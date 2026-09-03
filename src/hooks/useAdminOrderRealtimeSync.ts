import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguage } from '@/shared';
import { 
  AdminOrderCreatedPayload, 
  showAdminNewOrderToast 
} from '@/shared/components/notifications/AdminOrderNotification';

export const useAdminOrderRealtimeSync = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, token, role } = useAuthStore();
  const { t } = useLanguage();
  const lastOrderProcessedRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    const isStaffOrAdmin = role === 'ROLE_ADMIN' || role === 'ROLE_STAFF';
    if (!isStaffOrAdmin) return;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
    const sseUrl = `${apiUrl}/orders/stream?admin=true${
      token ? `&token=${encodeURIComponent(token)}` : ''
    }${user?.email ? `&email=${encodeURIComponent(user.email)}` : ''}`;

    let eventSource: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleNewOrder = (payload: AdminOrderCreatedPayload) => {
      if (!payload || !payload.orderId) return;

      // Deduplicate events within 3 seconds
      const now = Date.now();
      if (lastOrderProcessedRef.current[payload.orderId] && now - lastOrderProcessedRef.current[payload.orderId] < 3000) {
        return;
      }
      lastOrderProcessedRef.current[payload.orderId] = now;

      // 1. Invalidate admin orders query to refresh tables & badges instantly
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      // 2. Show luxury admin notification toast
      showAdminNewOrderToast(payload, t, () => navigate('/admin/orders'));
    };

    // 1. Setup Server-Sent Events (SSE) Stream for Admin
    try {
      eventSource = new EventSource(sseUrl);

      eventSource.addEventListener('order-created', (event: MessageEvent) => {
        try {
          const data: AdminOrderCreatedPayload = JSON.parse(event.data);
          handleNewOrder(data);
        } catch {
          // ignore parsing error
        }
      });

      eventSource.addEventListener('admin-order-updated', () => {
        // Silently refresh admin orders table and status badges
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      });

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
        }
        reconnectTimeout = setTimeout(() => {
          // auto reconnect
        }, 15000);
      };
    } catch {
      // EventSource failed or unsupported
    }

    // 2. Setup BroadcastChannel for 0ms cross-tab sync during local testing
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        broadcastChannel = new BroadcastChannel('eiffel-sync');
        broadcastChannel.onmessage = (event) => {
          if (event?.data?.type === 'ORDER_CREATED' && event.data.payload) {
            handleNewOrder(event.data.payload);
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
  }, [user, token, role, queryClient, navigate, t]);
};
