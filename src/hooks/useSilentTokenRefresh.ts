import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

// Interval to proactively refresh token (every 10 minutes, since token expires in 15 minutes)
const SILENT_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export const useSilentTokenRefresh = () => {
  const { isAuthenticated, token, refreshToken, refreshSession } = useAuthStore();
  const lastRefreshTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isAuthenticated && !token) {
      return;
    }

    // Proactive background interval timer
    const intervalId = setInterval(async () => {
      if (document.visibilityState === 'visible') {
        const success = await refreshSession();
        if (success) {
          lastRefreshTimeRef.current = Date.now();
        }
      }
    }, SILENT_REFRESH_INTERVAL_MS);

    // Tab visibility & focus handler (when user switches back to the tab)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastRefresh = Date.now() - lastRefreshTimeRef.current;
        // If more than 8 minutes have passed since last refresh, refresh immediately
        if (timeSinceLastRefresh > 8 * 60 * 1000) {
          const success = await refreshSession();
          if (success) {
            lastRefreshTimeRef.current = Date.now();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [isAuthenticated, token, refreshToken, refreshSession]);
};
