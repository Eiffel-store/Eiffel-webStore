import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useStoreData, useCurrency, useLanguage } from '@/shared';
import { useCart } from '@/features/cart';

export const ShopTheLook: React.FC = () => {
  const { products = [], homeSettings } = useStoreData();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { isRTL } = useLanguage();

  const look = homeSettings?.shopTheLook;

  // Don't render empty dummy look if nothing is configured and no products exist
  if (!look?.imageUrl && (!products || products.length === 0)) {
    return null;
  }

  const title = isRTL ? (look?.titleAr || 'تسوق الإطلالة') : (look?.titleEn || 'Shop The Look');
  const subtitle = isRTL ? (look?.subtitleAr || 'تنسيق الإطلالة الكاملة') : (look?.subtitleEn || 'Curated Ensemble');
  const mainImage = look?.imageUrl || products?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';
  
  // Resolve products configured in look.hotspots or fallback to first 3 products
  const hotspots = look?.hotspots || [];
  const lookProducts = hotspots.length > 0
    ? hotspots.map(spot => {
        const matching = products.find(p => p.id === spot.productId);
        if (matching) return matching;
        return {
          id: spot.productId || spot.id,
          name: isRTL ? spot.titleAr : spot.titleEn,
          subtitle: isRTL ? spot.titleEn : spot.titleAr,
          price: spot.price,
          images: [mainImage],
          category: 'men',
          inStock: true
        } as any;
      })
    : (products || []).slice(0, 3);

  return (
    <section className="py-12 sm:py-20 px-3 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-10 pb-3 sm:pb-4 border-b border-surface-container dark:border-zinc-800">
        <div>
          <span className="text-[10px] sm:text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
            {subtitle}
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-primary dark:text-white mt-1">
            {title}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Editorial Visual with Pins */}
        <div className="lg:col-span-7 relative aspect-[3/4] sm:aspect-[4/3] lg:aspect-[3/4] bg-zinc-950 overflow-hidden shadow-xl group rounded-lg">
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Interactive Pins Overlay */}
          {hotspots.map((spot, idx) => (
            <div
              key={spot.id || idx}
              style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-black text-[11px] font-bold flex items-center justify-center shadow-2xl border-2 border-black animate-pulse"
              title={`${isRTL ? spot.titleAr : spot.titleEn} (${spot.price} EGP)`}
            >
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Products in this Look */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-label-bold tracking-widest text-secondary dark:text-zinc-400 uppercase">
            {isRTL ? 'القطع المكونة للإطلالة' : 'Pieces in this look'}
          </h3>
          <div className="space-y-3">
            {lookProducts.map((product, idx) => {
              if (!product) return null;
              const prodImg = product?.images?.[0] || mainImage;
              return (
                <div
                  key={product.id || idx}
                  className="flex items-center justify-between p-3 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 hover:border-primary dark:hover:border-white transition-colors rounded"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={prodImg}
                      alt={product.name || 'Product'}
                      className="w-14 h-18 object-cover bg-zinc-800 rounded"
                    />
                    <div>
                      <h4 className="font-editorial text-sm font-bold text-primary dark:text-white line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-secondary dark:text-zinc-400 font-mono">
                        {formatPrice(product.price || 0)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="px-3 py-2 bg-primary text-white dark:bg-white dark:text-black text-[11px] font-label-bold tracking-wider uppercase hover:opacity-90 flex items-center gap-1 shrink-0 rounded cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'إضافة' : 'Add'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
