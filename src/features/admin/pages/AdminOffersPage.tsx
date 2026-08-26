import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStoreData, useLanguage, AdminTableSkeleton } from '@/shared';
import { AdminOffersTable } from '../components/offers/AdminOffersTable';
import { AdminCouponsManager } from '../components/offers/AdminCouponsManager';
import { AdminAddOfferModal } from '../components/offers/AdminAddOfferModal';

export const AdminOffersPage: React.FC = () => {
  const { products, updateProduct, isProductsLoading } = useStoreData();
  const { t } = useLanguage();
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);

  const offerProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);

  const handleApplyOffer = (productId: string, salePrice: number, baseOriginalPrice?: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const originalPrice = baseOriginalPrice || (product.originalPrice && product.originalPrice > product.price ? product.originalPrice : product.price);

    updateProduct(productId, {
      price: salePrice,
      originalPrice: originalPrice
    });
    setShowAddOfferModal(false);
  };

  const handleRemoveOffer = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || !product.originalPrice) return;

    updateProduct(productId, {
      price: product.originalPrice,
      originalPrice: undefined
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
            {t.adminOffers}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {t.adminCouponsPromoCodes}
          </p>
        </div>

        <button
          onClick={() => setShowAddOfferModal(true)}
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.adminAddProductToOffers}</span>
        </button>
      </div>

      {isProductsLoading && products.length === 0 ? (
        <AdminTableSkeleton rows={5} />
      ) : (
        <>
          {/* 1. Discounted Products Table */}
          <AdminOffersTable
            products={offerProducts}
            onRemoveOffer={handleRemoveOffer}
            onOpenAddModal={() => setShowAddOfferModal(true)}
          />

          {/* 2. Promo Coupons Engine */}
          <AdminCouponsManager />
        </>
      )}

      {/* Add to Offer Modal */}
      <AdminAddOfferModal
        isOpen={showAddOfferModal}
        onClose={() => setShowAddOfferModal(false)}
        products={products}
        onApplyOffer={handleApplyOffer}
      />
    </div>
  );
};
