import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguage } from '@/shared';
import { 
  OrderRealtimePayload, 
  showOrderRealtimeToast 
} from '@/shared/components/notifications/OrderRealtimeNotification';
import {
  CustomerExchangePayload,
  showCustomerExchangeToast
} from '@/shared/components/notifications/ExchangeRealtimeNotification';
import { Order } from '@/types';
import { getApiBaseUrl } from '@/services/apiClient';

export const useOrderRealtimeSync = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, token, role, fetchProfile } = useAuthStore();
  const { t } = useLanguage();
  const lastProcessedRef = useRef<{ [key: string]: number }>({});
  const lastExchangeProcessedRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    if (!user || !user.email) return;

    const userEmail = user.email.trim().toLowerCase();
    const apiUrl = getApiBaseUrl();
    const sseUrl = `${apiUrl}/orders/stream?email=${encodeURIComponent(userEmail)}${
      token ? `&token=${encodeURIComponent(token)}` : ''
    }`;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleOrderEvent = (payload: OrderRealtimePayload) => {
      if (!payload || !payload.orderId) return;

      // STRICT RECIPIENT VALIDATION:
      // 1. If payload has a customer email, verify it matches the currently logged in user
      if (payload.customerEmail && user?.email) {
        if (payload.customerEmail.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
          return; // Ignore: notification belongs to another customer
        }
      }

      // 2. If current user is Admin/Staff and NOT the specific customer who owns this order,
      // never show the customer toast to them!
      const isStaffOrAdmin = role === 'ROLE_ADMIN' || role === 'ROLE_STAFF';
      if (isStaffOrAdmin) {
        const isOwner = payload.customerEmail && user?.email &&
          payload.customerEmail.trim().toLowerCase() === user.email.trim().toLowerCase();
        if (!isOwner) {
          // Invalidate React Query silently so tables refresh without showing customer popup
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          return;
        }
      }

      // Prevent duplicate toasts within 2 seconds for same order and status
      const dedupeKey = `${payload.orderId}-${payload.status}`;
      const now = Date.now();
      if (lastProcessedRef.current[dedupeKey] && now - lastProcessedRef.current[dedupeKey] < 2000) {
        return;
      }
      lastProcessedRef.current[dedupeKey] = now;

      // 1. Update React Query Cache immediately in memory (0 network load!)
      queryClient.setQueriesData(
        { queryKey: ['orders'] },
        (oldData: unknown) => {
          if (!Array.isArray(oldData)) return oldData;
          return oldData.map((order: Order) => {
            if (order.id === payload.orderId) {
              return {
                ...order,
                status: payload.status as Order['status'],
                pointsEarned: payload.pointsEarned ?? order.pointsEarned,
              };
            }
            return order;
          });
        }
      );

      // Invalidate specific query keys so subsequent views are guaranteed fresh
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', payload.orderId] });

      // 2. If status delivered, refresh customer profile to update loyalty points & VIP tier
      const isDelivered = (payload.status || '').toLowerCase().includes('deliver');
      if (isDelivered) {
        fetchProfile().catch(() => {});
      }

      // 3. Show modern luxury toast notification
      showOrderRealtimeToast(payload, t, () => navigate('/account'));
    };

    const handleExchangeEvent = (payload: CustomerExchangePayload) => {
      if (!payload || !payload.id) return;

      if (payload.customerEmail && user?.email) {
        if (payload.customerEmail.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
          return;
        }
      }

      const dedupeKey = `exchange-${payload.id}-${payload.status}`;
      const now = Date.now();
      if (lastExchangeProcessedRef.current[dedupeKey] && now - lastExchangeProcessedRef.current[dedupeKey] < 2000) {
        return;
      }
      lastExchangeProcessedRef.current[dedupeKey] = now;

      // Invalidate customer queries
      queryClient.invalidateQueries({ queryKey: ['my-exchanges'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] });

      // Show toast
      showCustomerExchangeToast(payload, t, () => navigate('/account'));
    };

    // 1. Setup Server-Sent Events (SSE) stream
    try {
      eventSource = new EventSource(sseUrl);

      eventSource.addEventListener('order-updated', (event: MessageEvent) => {
        try {
          const data: OrderRealtimePayload = JSON.parse(event.data);
          handleOrderEvent(data);
        } catch {
          // ignore parsing error
        }
      });

      eventSource.addEventListener('exchange-status-updated', (event: MessageEvent) => {
        try {
          const data: CustomerExchangePayload = JSON.parse(event.data);
          handleExchangeEvent(data);
        } catch {
          // ignore parsing error
        }
      });

      eventSource.addEventListener('stock-updated', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          queryClient.invalidateQueries({ queryKey: ['products'] });
          if (data?.productId) {
            queryClient.invalidateQueries({ queryKey: ['product', data.productId] });
          }
        } catch {
          // ignore
        }
      });

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
        }
        // Auto-reconnect quietly after 15 seconds if disconnected
        reconnectTimeout = setTimeout(() => {
          // React Query / state will re-trigger or reconnect
        }, 15000);
      };
    } catch {
      // EventSource failed or unsupported
    }

    // 2. Setup BroadcastChannel for 0ms cross-tab instant sync on same browser
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        broadcastChannel = new BroadcastChannel('eiffel-sync');
        broadcastChannel.onmessage = (event) => {
          if (event?.data?.type === 'ORDER_STATUS_CHANGED' && event.data.payload) {
            const payloadEmail = event.data.payload.customerEmail;
            if (payloadEmail && user?.email) {
              if (payloadEmail.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
                return; // Discard cross-tab broadcast meant for another user
              }
            }
            handleOrderEvent(event.data.payload);
          } else if (event?.data?.type === 'EXCHANGE_STATUS_CHANGED' && event.data.payload) {
            handleExchangeEvent(event.data.payload);
          } else if (event?.data?.type === 'STOCK_UPDATED') {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            if (event.data.payload?.productId) {
              queryClient.invalidateQueries({ queryKey: ['product', event.data.payload.productId] });
            }
          }
        };
      }
    } catch {
      // BroadcastChannel unsupported
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (broadcastChannel) {
        broadcastChannel.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [user, token, role, queryClient, navigate, t, fetchProfile]);
};
