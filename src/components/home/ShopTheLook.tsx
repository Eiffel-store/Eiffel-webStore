import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingBag, X } from 'lucide-react';
import { PRODUCTS, LOOKBOOK_HOTSPOTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';

export const ShopTheLook: React.FC = () => {
  const [activeLook, setActiveLook] = useState(LOOKBOOK_HOTSPOTS[0]);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  const selectedHotspotProduct = activeHotspotId
    ? PRODUCTS.find(p => p.id === activeHotspotId)
    : null;

  return (
    <section className="bg-surface-container-low dark:bg-zinc-900 py-12 sm:py-20 px-3 sm:px-8 md:px-12 border-y border-surface-container dark:border-zinc-800">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-[10px] sm:text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
            {t.shopTheLookSubtitle}
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl text-primary dark:text-white mt-1">
            {t.shopTheLookTitle}
          </h2>
          <p className="text-xs text-secondary dark:text-zinc-400 mt-1.5 sm:mt-2 font-light px-4">
            {t.shopTheLookDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Lookbook Canvas with Hotspots */}
          <div className="lg:col-span-8 relative aspect-[4/5] bg-zinc-950 overflow-hidden border border-surface-container dark:border-zinc-800 shadow-xl">
            <img
              src={activeLook.image}
              alt={activeLook.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Hotspot Markers */}
            {activeLook.products.map((item) => {
              const product = PRODUCTS.find(p => p.id === item.productId);
              const isHotspotActive = activeHotspotId === item.productId;
              return (
                <div
                  key={item.productId}
                  style={{ top: item.top, left: item.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <button
                    onClick={() => {
                      if (activeHotspotId === item.productId) {
                        setActiveHotspotId(null);
                      } else {
                        setActiveHotspotId(item.productId);
                      }
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold flex items-center justify-center shadow-2xl ring-4 ring-black/40 transition-all ${
                      isHotspotActive 
                        ? 'bg-primary text-white scale-125 ring-white/50' 
                        : 'bg-white text-black hover:scale-125'
                    }`}
                    aria-label={item.label}
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>

                  {/* Desktop Hotspot Tooltip */}
                  <div className="hidden md:group-hover:flex absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-black/90 backdrop-blur-md border border-zinc-700 p-3 w-48 text-white flex-col gap-1 z-30 shadow-2xl animate-fade-in pointer-events-auto">
                    <span className="font-editorial text-sm line-clamp-1">{item.label}</span>
                    <span className="font-mono text-xs text-zinc-300 font-bold">
                      {product ? formatPrice(product.price) : ''}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product) addToCart(product, product.sizes[0], product.colors[0]?.name, 1);
                      }}
                      className="mt-1 py-1 px-2 bg-white text-black text-[10px] font-label-bold uppercase tracking-wider hover:bg-zinc-200"
                    >
                      {t.quickAdd}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Mobile Active Hotspot Floating Card */}
            {selectedHotspotProduct && (
              <div className="md:hidden absolute inset-x-3 bottom-14 z-30 p-3 bg-surface-container-lowest/95 dark:bg-zinc-950/95 backdrop-blur-md border border-surface-container dark:border-zinc-700 shadow-2xl animate-fade-in flex items-center justify-between gap-3">
                <img
                  src={selectedHotspotProduct.images[0]}
                  alt={selectedHotspotProduct.name}
                  className="w-12 h-14 object-cover shrink-0 bg-surface-container"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-editorial text-sm text-primary dark:text-white truncate">
                    {selectedHotspotProduct.name}
                  </h4>
                  <span className="font-mono text-xs font-bold text-primary dark:text-white">
                    {formatPrice(selectedHotspotProduct.price)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      addToCart(selectedHotspotProduct, selectedHotspotProduct.sizes[0], selectedHotspotProduct.colors[0]?.name, 1);
                      setActiveHotspotId(null);
                    }}
                    className="p-2 bg-primary text-white dark:bg-white dark:text-black text-xs font-label-bold uppercase flex items-center gap-1 shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t.quickAdd}</span>
                  </button>
                  <button
                    onClick={() => setActiveHotspotId(null)}
                    className="p-2 text-secondary hover:text-primary dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Lookbook Switcher */}
            <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex gap-1.5 sm:gap-2 z-20 overflow-x-auto max-w-[85%] scrollbar-none">
              {LOOKBOOK_HOTSPOTS.map((look) => (
                <button
                  key={look.id}
                  onClick={() => {
                    setActiveLook(look);
                    setActiveHotspotId(null);
                  }}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-label-bold uppercase tracking-wider backdrop-blur-md transition-all whitespace-nowrap ${
                    activeLook.id === look.id
                      ? 'bg-white text-black shadow-md'
                      : 'bg-black/60 text-white hover:bg-black/80'
                  }`}
                >
                  {look.title.split('/')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Ensemble List */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4">
            <h3 className="font-editorial text-xl sm:text-2xl text-primary dark:text-white uppercase tracking-wider pb-2 sm:pb-3 border-b border-surface-container dark:border-zinc-800">
              {activeLook.title} {isRTL ? '— الإطلالة المنسقة' : 'Curated Ensemble'}
            </h3>

            <div className="space-y-2.5 sm:space-y-3">
              {activeLook.products.map((item) => {
                const product = PRODUCTS.find(p => p.id === item.productId);
                if (!product) return null;
                return (
                  <div
                    key={item.productId}
                    className="p-3 sm:p-4 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 flex gap-3 sm:gap-4 items-center justify-between group shadow-sm"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 sm:w-16 h-18 sm:h-20 object-cover bg-surface-container shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-editorial text-sm sm:text-base text-primary dark:text-white group-hover:underline truncate">
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                      </h4>
                      <p className="text-xs font-mono text-secondary dark:text-zinc-400 mt-0.5">
                        {formatPrice(product.price)}
                      </p>
                      <button
                        onClick={() => addToCart(product, product.sizes[0], product.colors[0]?.name, 1)}
                        className="mt-1.5 text-[10px] sm:text-[11px] font-label-bold uppercase tracking-wider text-primary dark:text-white hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{t.addToBag}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
