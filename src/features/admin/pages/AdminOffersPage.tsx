import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Percent,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useStoreData } from '@/shared';
import { useLanguage } from '@/shared';
import { useCurrency } from '@/shared';

export const AdminOffersPage: React.FC = () => {
  const { products, updateProduct, coupons, addCoupon, updateCoupon, deleteCoupon } = useStoreData();
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  // Coupon state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState<number>(10);
  const [newCouponMinAmount, setNewCouponMinAmount] = useState<number>(500);

  // Add Product to Offer Modal state
  const [selectedProductId, setSelectedProductId] = useState('');
  const [offerSalePrice, setOfferSalePrice] = useState<number>(0);
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);

  const offerProducts = products.filter(p => p.originalPrice && p.originalPrice > p.price);
  const nonOfferProducts = products.filter(p => !p.originalPrice || p.originalPrice <= p.price);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: Number(newCouponDiscount),
      minOrderAmount: Number(newCouponMinAmount),
      isActive: true
    });

    setNewCouponCode('');
    setNewCouponDiscount(10);
    setNewCouponMinAmount(500);
  };

  const handleApplyOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || offerSalePrice <= 0) return;

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    updateProduct(product.id, {
      originalPrice: product.price, // move current price to originalPrice
      price: offerSalePrice // set new reduced sale price
    });

    setShowAddOfferModal(false);
    setSelectedProductId('');
    setOfferSalePrice(0);
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
            {isRTL ? 'العروض والتخفيضات والكوبونات' : 'Offers & Promotions Engine'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isRTL
              ? 'التحكم في صفحة العروض الخاصة وإنشاء وتعديل أكواد الخصم للمتجر.'
              : 'Control /collections/offers section and create promo coupon codes.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddOfferModal(true)}
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isRTL ? 'إضافة منتج لقسم العروض' : 'Add Product to Offers'}</span>
        </button>
      </div>

      {/* Add Offer Modal */}
      {showAddOfferModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>{isRTL ? 'تفعيل عرض على منتج' : 'Enable Special Offer'}</span>
            </h3>

            <form onSubmit={handleApplyOffer} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-300 mb-1.5 font-bold">
                  {isRTL ? 'اختر المنتج من الكتالوج' : 'Select Product'}
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) {
                      setOfferSalePrice(Math.round(prod.price * 0.8)); // default 20% off
                    }
                  }}
                  required
                  className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                >
                  <option value="">{isRTL ? '-- اختر منتجاً --' : '-- Choose a product --'}</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatPrice(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProductId && (
                <div>
                  <label className="block text-xs text-zinc-300 mb-1.5 font-bold">
                    {isRTL ? 'السعر المخفض الجديد (ج.م)' : 'New Discounted Sale Price (EGP)'}
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={offerSalePrice}
                    onChange={(e) => setOfferSalePrice(Number(e.target.value))}
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-white"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                    {isRTL ? 'سيتم نقل السعر القديم ليظهر مشطوباً عليه تلقائياً.' : 'Original price will be shown struck-through.'}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOfferModal(false)}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!selectedProductId || offerSalePrice <= 0}
                  className="flex-1 py-2 bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isRTL ? 'تطبيق العرض' : 'Apply Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section 1: Active Special Offers in Storefront */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isRTL ? 'المنتجات المعروضة في صفحة التخفيضات' : 'Products in /offers Collection'}</span>
            </h2>
            <p className="text-xs text-zinc-500">
              {isRTL
                ? `يوجد ${offerProducts.length} قطعة معروضة بخصومات حالياً في المتجر.`
                : `${offerProducts.length} products currently active with discounted strike-through pricing.`}
            </p>
          </div>
          <a
            href={`${import.meta.env.BASE_URL}#/collections/offers`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono"
          >
            <span>{isRTL ? 'معاينة صفحة العروض' : 'Preview /offers'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {offerProducts.length === 0 ? (
          <div className="py-10 text-center text-zinc-500 text-xs">
            <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>{isRTL ? 'لا توجد منتجات مخفضة حالياً.' : 'No discounted items currently.'}</p>
            <button
              onClick={() => setShowAddOfferModal(true)}
              className="mt-3 px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 text-xs font-mono"
            >
              + {isRTL ? 'إضافة أول عرض' : 'Add First Offer'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {offerProducts.map((p) => {
              const discountPercent = Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100);
              return (
                <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-3 flex gap-3 relative group">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-20 h-24 object-cover bg-zinc-950 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-xs text-white truncate">{p.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{p.category}</div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="font-bold text-sm text-white font-mono">{formatPrice(p.price)}</span>
                        <span className="text-xs text-zinc-500 line-through font-mono">{formatPrice(p.originalPrice!)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded font-mono">
                        {discountPercent}% OFF
                      </span>
                      <button
                        onClick={() => handleRemoveOffer(p.id)}
                        className="text-[10px] text-red-400 hover:underline font-mono"
                      >
                        {isRTL ? 'إلغاء العرض' : 'End Offer'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Promo Discount Coupons */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-6">
        <div className="pb-3 border-b border-zinc-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Percent className="w-4 h-4 text-emerald-400" />
            <span>{isRTL ? 'أكواد وكوبونات الخصم' : 'Promo Coupon Codes'}</span>
          </h2>
          <p className="text-xs text-zinc-500">
            {isRTL
              ? 'إنشاء أكواد خصم يكتبها العميل في صفحة الـ Checkout للحصول على تخفيض فوري.'
              : 'Create promo codes that clients can enter during checkout for instant discounts.'}
          </p>
        </div>

        {/* Create Coupon Form */}
        <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-zinc-900 p-4 border border-zinc-800">
          <div>
            <label className="block text-[11px] text-zinc-300 font-bold mb-1">
              {isRTL ? 'كود الخصم (مثال: EIFFEL20)' : 'Promo Code'}
            </label>
            <input
              type="text"
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
              placeholder="e.g. VIP25"
              required
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-300 font-bold mb-1">
              {isRTL ? 'نسبة الخصم (%)' : 'Discount Percentage (%)'}
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={newCouponDiscount}
              onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
              required
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-300 font-bold mb-1">
              {isRTL ? 'الحد الأدنى للطلب (ج.م)' : 'Min Order (EGP)'}
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={newCouponMinAmount}
              onChange={(e) => setNewCouponMinAmount(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              + {isRTL ? 'إنشاء الكوبون' : 'Add Coupon'}
            </button>
          </div>
        </form>

        {/* Coupons List */}
        <div className="divide-y divide-zinc-800">
          {coupons.map((c) => (
            <div key={c.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-zinc-900 border border-zinc-700 font-mono font-bold text-sm text-white tracking-widest">
                  {c.code}
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-400">{c.discountPercentage}% {isRTL ? 'خصم' : 'Discount'}</div>
                  {c.minOrderAmount ? (
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {isRTL ? `للطلبات أكثر من ${formatPrice(c.minOrderAmount)}` : `On orders over ${formatPrice(c.minOrderAmount)}`}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateCoupon(c.id, { isActive: !c.isActive })}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded flex items-center gap-1 ${
                    c.isActive
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {c.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  <span>{c.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'معطل' : 'Disabled')}</span>
                </button>

                <button
                  onClick={() => deleteCoupon(c.id)}
                  className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                  title={isRTL ? 'حذف' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
