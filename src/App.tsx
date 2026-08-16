import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/search/SearchModal';
import { ScrollToTop } from './components/common/ScrollToTop';
import { FloatingContactButtons } from './components/common/FloatingContactButtons';

import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { StoreLocatorPage } from './pages/StoreLocatorPage';
import { HelpCenterPage } from './pages/HelpCenterPage';

export const App: React.FC = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Router basename={import.meta.env.BASE_URL}>
                  <ScrollToTop />
                  <div className="flex flex-col min-h-screen bg-background text-on-surface transition-colors duration-200">
                    <Navbar onOpenSearch={() => setSearchOpen(true)} />
                    
                    <div className="flex-1">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/collections/:category" element={<CollectionsPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/account" element={<AccountPage />} />
                        <Route path="/stores" element={<StoreLocatorPage />} />
                        <Route path="/help" element={<HelpCenterPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </div>

                    <Footer />
                    
                    {/* Global Cart Drawer */}
                    <CartDrawer />
                    
                    {/* Global Search Modal */}
                    <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

                    {/* Floating Social Quick Action Buttons (WhatsApp & Facebook) */}
                    <FloatingContactButtons />
                  </div>
                </Router>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

export default App;
