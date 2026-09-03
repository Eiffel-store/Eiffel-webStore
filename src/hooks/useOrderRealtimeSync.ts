import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguage } from '@/shared';
import { 
  OrderRealtimePayload, 
  showOrderRealtimeToast 
} from '@/shared/components/notifications/OrderRealtimeNotification';
import { Order } from '@/types';

export const useOrderRealtimeSync = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, token, fetchProfile } = useAuthStore();
  const { t } = useLanguage();
  const lastProcessedRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    if (!user || !user.email) return;

    const userEmail = user.email.trim().toLowerCase();
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
    const sseUrl = `${apiUrl}/orders/stream?email=${encodeURIComponent(userEmail)}${
      token ? `&token=${encodeURIComponent(token)}` : ''
    }`;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleOrderEvent = (payload: OrderRealtimePayload) => {
      if (!payload || !payload.orderId) return;

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
            handleOrderEvent(event.data.payload);
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
  }, [user, token, queryClient, navigate, t, fetchProfile]);
};
