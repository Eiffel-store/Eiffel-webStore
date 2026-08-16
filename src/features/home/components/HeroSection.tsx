import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/shared';

export const HeroSection: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative w-full min-h-[78vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white">
      {/* Background Image with subtle gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}images/products/eiffel-outfit-flatlay.jpg`}
          alt="EIFFEL Collection Campaign"
          className="w-full h-full object-cover object-center opacity-60 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/70" />
      </div>

      {/* Hero Editorial Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 py-12 sm:py-20 w-full flex flex-col justify-end min-h-[78vh] sm:min-h-[85vh]">
        <div className="max-w-3xl">
          <span className="inline-block bg-white text-black font-label-bold text-[10px] sm:text-xs tracking-widest px-2.5 sm:px-3 py-1 uppercase mb-3 sm:mb-4 shadow-md">
            {t.heroSeason}
          </span>
          <h1 className="font-editorial text-4xl sm:text-7xl md:text-8xl lg:text-9xl leading-[1.0] sm:leading-[0.95] tracking-tight text-white uppercase drop-shadow-sm">
            {t.heroTitle}
          </h1>
          <p className="font-inter text-xs sm:text-base md:text-lg text-zinc-300 mt-4 sm:mt-6 max-w-xl leading-relaxed font-light">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link
              to="/collections/men"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-label-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>{t.exploreCollection}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/collections/new-arrivals"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent border border-white text-white font-label-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all text-center"
            >
              {t.viewLookbook}
            </Link>
          </div>
        </div>

        {/* Bottom Hero Metadata Strip */}
        <div className="mt-10 sm:mt-16 pt-4 sm:pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] sm:text-xs font-mono text-zinc-400 gap-2 sm:gap-4">
          <div>{t.heroCampaign}</div>
          <div>{t.heroLocation}</div>
          <div>{t.heroFabrication}</div>
        </div>
      </div>
    </section>
  );
};
