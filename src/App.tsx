import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/stores/useAuthStore';
import { useSilentTokenRefresh } from '@/hooks/useSilentTokenRefresh';
import { ScrollToTop } from '@/shared';
import { AppProviders } from '@/providers';
import { AppRoutes, SearchModal } from '@/routes';

import { useOrderRealtimeSync } from '@/hooks/useOrderRealtimeSync';

const OrderRealtimeSyncManager: React.FC = () => {
  useOrderRealtimeSync();
  return null;
};

export const App: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { token, isAuthenticated, fetchProfile } = useAuthStore();

  // Proactive silent token refresh to keep session alive securely while working
  useSilentTokenRefresh();

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('eiffel_auth_token');
    const isValidStoredToken = Boolean(
      storedToken &&
      storedToken !== 'undefined' &&
      storedToken !== 'null' &&
      storedToken.trim().length > 10
    );

    if (isValidStoredToken || (isAuthenticated && token)) {
      fetchProfile();
    }
  }, [token, isAuthenticated, fetchProfile]);

  return (
    <AppProviders>
      <Router basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <OrderRealtimeSyncManager />

        {/* Centralized Application Route Tree */}
        <AppRoutes onOpenSearch={() => setSearchOpen(true)} />

        {/* Global Search Modal (Loaded on-demand) */}
        {searchOpen && (
          <Suspense fallback={null}>
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          </Suspense>
        )}

        {/* Luxury Hot Toast Notifications */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 3500,
            style: {
              background: '#09090b',
              color: '#f4f4f5',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              borderRadius: '0.75rem',
              padding: '12px 18px',
              fontSize: '0.8125rem',
              fontFamily: 'inherit',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.6)',
            },
            success: {
              iconTheme: {
                primary: '#fbbf24',
                secondary: '#000000',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </Router>
    </AppProviders>
  );
};

export default App;
