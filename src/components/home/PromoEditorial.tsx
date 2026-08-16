import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';

export const PromoEditorial: React.FC = () => {
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  return (
    <section className="bg-surface-container-low dark:bg-zinc-900 py-10 sm:py-16 px-3 sm:px-8 md:px-12 border-y border-surface-container dark:border-zinc-800">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-zinc-950 shadow-md">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtlMPMoL7700KS7W09vGNpvaO9IyL9M9wRIDUaVAxOfh28ya1EckE_ee1Abioc4VkYhglrKeETr5rspW4yC9-UX4Fn8AGeKOVjlJnBFYUmxIT5pMiPQMtgBvmMsD_87fzylAjgHgFXgm6hqerqEHDlrQQPiKSN_j1jObUuc1WtaGeym1jz4t1_FRt0lWz1J9Qp1Y4JgzKLjvJkx-0LzM0O5VuhjPjtNA3orj1ByUu1RgU6Aw2SutEL3A"
            alt="Monolith Double-Breasted Trench"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 bg-primary text-white text-[9px] sm:text-[10px] font-label-bold tracking-widest px-2.5 py-1 uppercase shadow-md">
            {t.promoCapsule}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-6 lg:pl-6 rtl:lg:pl-0 rtl:lg:pr-6">
          <div>
            <span className="text-[10px] sm:text-xs font-label-bold tracking-widest text-secondary dark:text-zinc-400 uppercase">
              {t.exclusiveBadge}
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl text-primary dark:text-white leading-[1.0] sm:leading-[0.95] mt-1">
              {t.promoTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-secondary dark:text-zinc-300 leading-relaxed font-light">
            {t.promoDesc}
          </p>

          <div className="flex flex-wrap items-baseline gap-3 pt-1">
            <span className="font-mono text-xl sm:text-2xl font-bold text-primary dark:text-white">{formatPrice(940)}</span>
            <span className="text-xs font-mono text-secondary line-through">{formatPrice(1100)}</span>
            <span className="text-xs font-label-bold text-green-600 dark:text-green-400">{t.promoTailoringNotice}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/product/eiffel-monolith-overcoat"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>{t.acquirePiece}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <button
              onClick={() => {
                const product = PRODUCTS.find(p => p.id === 'eiffel-monolith-overcoat');
                if (product) addToCart(product, '48 (M)', 'Carbon Black', 1);
              }}
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 border border-primary dark:border-white font-label-bold text-xs tracking-widest uppercase text-primary dark:text-white hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.quickAdd}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
