import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useStoreData, useCurrency, useLanguage } from '@/shared';
import { useCart } from '@/features/cart';

export const ShopTheLook: React.FC = () => {
  const { products } = useStoreData();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { isRTL } = useLanguage();

  const lookProducts = products.slice(0, 3);
  const mainImage = products[0]?.images[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop';

  return (
    <section className="py-12 sm:py-20 px-3 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 pb-3 sm:pb-4 border-b border-surface-container dark:border-zinc-800">
        <div>
          <span className="text-[10px] sm:text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
            {isRTL ? 'تنسيق الإطلالة الكاملة' : 'Curated Ensemble'}
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-primary dark:text-white mt-1">
            {isRTL ? 'تسوق الإطلالة' : 'Shop The Look'}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Editorial Visual */}
        <div className="lg:col-span-7 relative aspect-[3/4] sm:aspect-[4/3] lg:aspect-[3/4] bg-zinc-950 overflow-hidden shadow-xl group">
          <img
            src={mainImage}
            alt="Editorial Look"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Products in this Look */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-label-bold tracking-widest text-secondary dark:text-zinc-400 uppercase">
            {isRTL ? 'القطع المكونة للإطلالة' : 'Pieces in this look'}
          </h3>
          <div className="space-y-3">
            {lookProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 hover:border-primary dark:hover:border-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-18 object-cover bg-zinc-800"
                  />
                  <div>
                    <h4 className="font-editorial text-sm font-bold text-primary dark:text-white line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-secondary dark:text-zinc-400 font-mono">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="px-3 py-2 bg-primary text-white dark:bg-white dark:text-black text-[11px] font-label-bold tracking-wider uppercase hover:opacity-90 flex items-center gap-1 shrink-0"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'إضافة' : 'Add'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
