import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Plus } from 'lucide-react';
import { PRODUCTS, CATEGORIES, LOOKBOOK_HOTSPOTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

export const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeLook, setActiveLook] = useState(LOOKBOOK_HOTSPOTS[0]);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  const newArrivals = PRODUCTS.filter(p => p.isNew || p.category === 'men').slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white">
        {/* Background Image with subtle gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCseUeu5hdr7LWtZska9tdU1nipaGbIV9oDB4qQIfpmf9TGBKI3WMIeHE7Dhi3cpBD1BLkDSNssElp43QgvSsbNFoyCtrgDtaWeFakgnquiUwsZGJutEtBBG2VrOwNvDhRXK2l4kEiDc6woEqKHLmR-wjLYVi085GjBUjBr9WGc_WUmlNMKBme8o3SAnoAIsLDlCOY_WmzxZ_2Siru3KoWJD9zwJNdMDng5OdcgPqc2VO_kGELw2iBIhg"
            alt="EIFFEL Hero Campaign"
            className="w-full h-full object-cover object-center opacity-65 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />
        </div>

        {/* Hero Editorial Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 py-20 w-full flex flex-col justify-end min-h-[85vh]">
          <div className="max-w-3xl">
            <span className="inline-block bg-white text-black font-label-bold text-xs tracking-widest px-3 py-1 uppercase mb-4">
              {t.heroSeason}
            </span>
            <h1 className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tight text-white uppercase drop-shadow-sm">
              {t.heroTitle}
            </h1>
            <p className="font-inter text-sm sm:text-base md:text-lg text-zinc-300 mt-6 max-w-xl leading-relaxed font-light">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/collections/men"
                className="px-8 py-4 bg-white text-black font-label-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
              >
                <span>{t.exploreCollection}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                to="/collections/new-arrivals"
                className="px-8 py-4 bg-transparent border border-white text-white font-label-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all"
              >
                {t.viewLookbook}
              </Link>
            </div>
          </div>

          {/* Bottom Hero Metadata Strip */}
          <div className="mt-16 pt-6 border-t border-white/20 flex flex-wrap justify-between items-center text-xs font-mono text-zinc-400 gap-4">
            <div>{t.heroCampaign}</div>
            <div>{t.heroLocation}</div>
            <div>{t.heroFabrication}</div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY ARCHIVES GRID */}
      <section className="py-20 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-surface-container dark:border-zinc-800">
          <div>
            <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
              {t.categoriesSubtitle}
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white mt-1">
              {t.categoriesTitle}
            </h2>
          </div>
          <Link
            to="/collections/men"
            className="mt-4 md:mt-0 font-label-bold text-xs tracking-widest text-primary dark:text-white hover:underline flex items-center gap-1 uppercase"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={cat.href}
              className="group relative aspect-[3/4] overflow-hidden bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover luxury-image-hover group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 text-white flex flex-col justify-end">
                <span className="font-mono text-[10px] tracking-widest text-zinc-300 uppercase">
                  {cat.count} {t.categoriesPieces}
                </span>
                <h3 className="font-editorial text-3xl tracking-tight text-white mt-1 group-hover:translate-x-1 transition-transform">
                  {isRTL && cat.id === 'men' ? 'تشكيلة الرجال' : isRTL && cat.id === 'kids' ? 'أزياء الأطفال' : isRTL && cat.id === 'accessories' ? 'القطع الجلدية' : isRTL ? 'مجموعة 04' : cat.title}
                </h3>
                <p className="text-xs text-zinc-300 mt-1 line-clamp-1 font-light">
                  {cat.subtitle}
                </p>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-label-bold tracking-widest uppercase text-white group-hover:underline">
                  <span>{t.discover}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. PROMOTIONAL EDITORIAL SPLIT */}
      <section className="bg-surface-container-low dark:bg-zinc-900 py-16 px-4 sm:px-8 md:px-12 border-y border-surface-container dark:border-zinc-800">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-zinc-950">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtlMPMoL7700KS7W09vGNpvaO9IyL9M9wRIDUaVAxOfh28ya1EckE_ee1Abioc4VkYhglrKeETr5rspW4yC9-UX4Fn8AGeKOVjlJnBFYUmxIT5pMiPQMtgBvmMsD_87fzylAjgHgFXgm6hqerqEHDlrQQPiKSN_j1jObUuc1WtaGeym1jz4t1_FRt0lWz1J9Qp1Y4JgzKLjvJkx-0LzM0O5VuhjPjtNA3orj1ByUu1RgU6Aw2SutEL3A"
              alt="Monolith Double-Breasted Trench"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-primary text-white text-[10px] font-label-bold tracking-widest px-3 py-1 uppercase">
              {t.promoCapsule}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:pl-6 rtl:lg:pl-0 rtl:lg:pr-6">
            <span className="text-xs font-label-bold tracking-widest text-secondary dark:text-zinc-400 uppercase">
              {t.exclusiveBadge}
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white leading-[0.95]">
              {t.promoTitle}
            </h2>
            <p className="text-sm text-secondary dark:text-zinc-300 leading-relaxed font-light">
              {t.promoDesc}
            </p>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="font-mono text-2xl font-bold text-primary dark:text-white">{formatPrice(940)}</span>
              <span className="text-xs font-mono text-secondary line-through">{formatPrice(1100)}</span>
              <span className="text-xs font-label-bold text-green-600 dark:text-green-400">{t.promoTailoringNotice}</span>
            </div>

            <div className="flex gap-4 pt-2">
              <Link
                to="/product/eiffel-monolith-overcoat"
                className="px-8 py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center gap-2"
              >
                <span>{t.acquirePiece}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <button
                onClick={() => {
                  const product = PRODUCTS.find(p => p.id === 'eiffel-monolith-overcoat');
                  if (product) addToCart(product, '48 (M)', 'Carbon Black', 1);
                }}
                className="px-6 py-4 border border-primary dark:border-white font-label-bold text-xs tracking-widest uppercase text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.quickAdd}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEW ARRIVALS GRID */}
      <section className="py-20 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full">
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-surface-container dark:border-zinc-800">
          <div>
            <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
              {t.newArrivalsSubtitle}
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white mt-1">
              {t.newArrivalsTitle}
            </h2>
          </div>
          <Link
            to="/collections/new-arrivals"
            className="font-label-bold text-xs tracking-widest text-primary dark:text-white hover:underline flex items-center gap-1 uppercase"
          >
            <span>{t.viewAll} ({PRODUCTS.length})</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 5. SHOP THE LOOK INTERACTIVE HOTSPOTS */}
      <section className="bg-surface-container-low dark:bg-zinc-900 py-20 px-4 sm:px-8 md:px-12 border-y border-surface-container dark:border-zinc-800">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
              {t.shopTheLookSubtitle}
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white mt-1">
              {t.shopTheLookTitle}
            </h2>
            <p className="text-xs text-secondary dark:text-zinc-400 mt-2 font-light">
              {t.shopTheLookDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Lookbook Canvas with Hotspots */}
            <div className="lg:col-span-8 relative aspect-[4/5] bg-zinc-950 overflow-hidden border border-surface-container dark:border-zinc-800">
              <img
                src={activeLook.image}
                alt={activeLook.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Hotspot Markers */}
              {activeLook.products.map((item) => {
                const product = PRODUCTS.find(p => p.id === item.productId);
                return (
                  <div
                    key={item.productId}
                    style={{ top: item.top, left: item.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  >
                    <button
                      onClick={() => product && addToCart(product, product.sizes[0], product.colors[0]?.name, 1)}
                      className="w-8 h-8 rounded-full bg-white text-black font-bold flex items-center justify-center shadow-2xl ring-4 ring-black/40 hover:scale-125 transition-transform"
                      aria-label={item.label}
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Popover Preview */}
                    <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 hidden group-hover:flex flex-col w-56 p-3 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-700 shadow-2xl z-30 pointer-events-auto">
                      <span className="font-editorial text-sm text-primary dark:text-white line-clamp-1">
                        {product?.name || item.label}
                      </span>
                      <span className="font-mono text-xs text-secondary dark:text-zinc-400 mt-0.5">
                        {product ? formatPrice(product.price) : ''}
                      </span>
                      {product && (
                        <button
                          onClick={() => addToCart(product, product.sizes[0], product.colors[0]?.name, 1)}
                          className="mt-2 py-1.5 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-[10px] tracking-wider uppercase"
                        >
                          {t.addToBag}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Look Switcher & Selected Items List */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex gap-3 pb-4 border-b border-surface-container dark:border-zinc-800">
                {LOOKBOOK_HOTSPOTS.map((look) => (
                  <button
                    key={look.id}
                    onClick={() => setActiveLook(look)}
                    className={`flex-1 py-3 px-4 text-xs font-label-bold tracking-wider uppercase border transition-all text-center ${
                      activeLook.id === look.id
                        ? 'border-primary dark:border-white bg-primary text-white dark:bg-white dark:text-black'
                        : 'border-surface-container dark:border-zinc-800 text-secondary dark:text-zinc-400 hover:border-primary'
                    }`}
                  >
                    {look.title.split('/')[0]}
                  </button>
                ))}
              </div>

              <div>
                <h3 className="font-editorial text-2xl text-primary dark:text-white">
                  {activeLook.title}
                </h3>
                <p className="text-xs text-secondary dark:text-zinc-400 mt-1 font-light">
                  {isRTL ? 'إطلالة متناسقة تجمع بين المعاطف الهيكلية والسراويل الصوفية الفاخرة.' : 'A high-contrast ensemble pairing structural outerwear with draped virgin wool trousers and lug-sole footwear.'}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-[11px] font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
                  {t.piecesInLook}
                </span>
                {activeLook.products.map((item) => {
                  const prod = PRODUCTS.find(p => p.id === item.productId);
                  if (!prod) return null;
                  return (
                    <div
                      key={item.productId}
                      className="p-3 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-12 h-14 object-cover bg-surface-container-low dark:bg-zinc-900"
                        />
                        <div>
                          <Link to={`/product/${prod.id}`} className="font-editorial text-sm text-primary dark:text-white hover:underline block line-clamp-1">
                            {prod.name}
                          </Link>
                          <span className="font-mono text-xs text-secondary dark:text-zinc-400 font-semibold">
                            {formatPrice(prod.price)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(prod, prod.sizes[0], prod.colors[0]?.name, 1)}
                        className="p-2.5 bg-surface-container-low dark:bg-zinc-800 text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                        title={t.addToBag}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BLACK EDITORIAL STATEMENT BANNER */}
      <section className="bg-primary text-white py-24 px-4 sm:px-8 md:px-12 border-y border-black">
        <div className="max-w-[1440px] mx-auto text-center flex flex-col items-center">
          <span className="text-xs font-label-bold tracking-widest text-zinc-400 uppercase mb-4">
            {t.philosophyTag}
          </span>
          <h2 className="font-editorial text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase max-w-5xl leading-[0.9]">
            {t.philosophyTitle}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mt-6 leading-relaxed font-light">
            {t.philosophyDesc}
          </p>
          <div className="mt-10 flex gap-4">
            <Link
              to="/journal"
              className="px-8 py-4 bg-white text-black font-label-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all flex items-center gap-2"
            >
              <span>{t.readJournal}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. KIDS COLLECTION HIGHLIGHT */}
      <section className="py-20 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
              {t.kidsHighlightTag}
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white leading-[0.95]">
              {t.kidsHighlightTitle}
            </h2>
            <p className="text-sm text-secondary dark:text-zinc-300 leading-relaxed font-light">
              {t.kidsHighlightDesc}
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                to="/collections/kids"
                className="px-8 py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center gap-2"
              >
                <span>{t.exploreKids}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] bg-surface-container-low dark:bg-zinc-900 overflow-hidden border border-surface-container dark:border-zinc-800">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqEKhdH1nhDpP4ry83vz4fynC4d8bEqQeHp7WylCqKZurzpeD5bqFuA_YRIxkDAnENejmX2EK-KMa5XY2r76Sf-wF7_ZILVtn0-ZH60rUKyld-ckb1X55GbKI8K9MWBZLjmJPTC5hQ2z5lYIkqb9sbqSQ5BfrVIr2Nai5wPW19ZlKt2J0vlNTPV8rOsefGTyNa5Fkl32fHq-_wi2x3XliLZLoGXqoARSlYqj6mbXzdN_gNqCjcZ9OQvA"
                alt="Kids Hoodie"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/5] bg-surface-container-low dark:bg-zinc-900 overflow-hidden border border-surface-container dark:border-zinc-800">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgX80lHjmbWKHoSuRPF5JZn0761MYQXo8sbO0JGXfLsjnhFjpE-whRdq9m6-iczrP-lTDp7bXGBU0Z3k71NhFyeCiCbFVm03Bjojz5Zsymuhf9HdE5T_VKn-taeRFyKtVSFtYfTj6WOpPDuZoQvf_VuzlYCEsfVXOI68H7xs7B7SafkXh0y0oz0-mGCOdpBBOV0Eib98ytdBotGXmRxz3bv8Xl-HGMEgONhewDzooqDu3_n_kd0_wUNA"
                alt="Kids Trousers"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
