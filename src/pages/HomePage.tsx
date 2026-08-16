import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { PromoEditorial } from '../components/home/PromoEditorial';
import { ShopTheLook } from '../components/home/ShopTheLook';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { t, isRTL } = useLanguage();

  const newArrivals = PRODUCTS.filter(p => p.isNew || p.category === 'men').slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. CATEGORY ARCHIVES GRID */}
      <CategoryGrid />

      {/* 3. PROMOTIONAL EDITORIAL SPLIT */}
      <PromoEditorial />

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
      <ShopTheLook />

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
