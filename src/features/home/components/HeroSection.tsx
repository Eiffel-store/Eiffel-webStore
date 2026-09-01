import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useLanguage, useStoreData, preloadImages } from '@/shared';
import { Banner } from '@/types';

export const HeroSection: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { settings, activeBanners = [], isBannersLoading, trackBannerImpression, trackBannerClick } = useStoreData();

  // 1. Get active Hero Slider banners from dynamic campaigns
  const heroBanners = activeBanners.filter(b => b.placement === 'HERO_SLIDER' && b.isActive !== false);

  const slides: Banner[] = heroBanners;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackedImpressions = useRef<Set<string>>(new Set());

  // Slider Autoplay & Interval configuration
  const isAutoPlay = settings?.heroAutoPlay !== false;
  const intervalSeconds = settings?.heroSliderIntervalSeconds && settings.heroSliderIntervalSeconds >= 2
    ? settings.heroSliderIntervalSeconds
    : 5;
  const intervalMs = intervalSeconds * 1000;

  // Preload all slider images on mount
  useEffect(() => {
    if (slides.length === 0) return;
    const urls = slides
      .map(s => s.desktopImageUrl || s.mobileImageUrl)
      .filter((u): u is string => Boolean(u));
    preloadImages(urls);
  }, [slides]);

  // Keep index within range
  const safeIndex = currentSlideIndex >= slides.length ? 0 : currentSlideIndex;
  const currentSlide = slides[safeIndex];

  // Track impression for current slide
  useEffect(() => {
    if (currentSlide?.id && !trackedImpressions.current.has(currentSlide.id)) {
      trackBannerImpression(currentSlide.id);
      trackedImpressions.current.add(currentSlide.id);
    }
  }, [currentSlide, trackBannerImpression]);

  // Dynamic Autoplay timer based on customized interval
  useEffect(() => {
    if (slides.length <= 1 || isPaused || !isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [slides.length, isPaused, isAutoPlay, intervalMs]);

  const handlePrev = () => {
    setCurrentSlideIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlideIndex(prev => (prev + 1) % slides.length);
  };

  const handleCtaClick = () => {
    if (currentSlide?.id && currentSlide.id !== 'fallback-hero') {
      trackBannerClick(currentSlide.id);
    }
  };

  // Prevent flash/flicker of two heroes while initial banners are loading
  if (isBannersLoading && activeBanners.length === 0) {
    return (
      <section className="relative w-full min-h-[82vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white select-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/70 animate-pulse" />
        <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 py-12 sm:py-20 w-full flex flex-col justify-end min-h-[82vh] sm:min-h-[88vh]">
          <div className="max-w-3xl space-y-4">
            <div className="w-32 h-6 bg-zinc-900 border border-zinc-800 rounded animate-pulse" />
            <div className="w-3/4 sm:w-2/3 h-14 sm:h-20 bg-zinc-900 border border-zinc-800 rounded animate-pulse" />
            <div className="w-1/2 h-5 bg-zinc-900/80 rounded animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  // If no banners exist, do not render hero section at all
  if (heroBanners.length === 0) {
    return null;
  }

  const tag = isRTL ? (currentSlide?.tagAr || t.heroSeason) : (currentSlide?.tagEn || t.heroSeason);
  const title = isRTL ? (currentSlide?.titleAr || t.heroTitle) : (currentSlide?.titleEn || t.heroTitle);
  const subtitle = isRTL ? (currentSlide?.subtitleAr || t.heroSubtitle) : (currentSlide?.subtitleEn || t.heroSubtitle);
  const buttonText = isRTL ? (currentSlide?.buttonTextAr || t.exploreCollection) : (currentSlide?.buttonTextEn || t.exploreCollection);
  const buttonLink = currentSlide?.buttonLink || '/collections/men';
  const secondaryButtonText = isRTL ? (currentSlide?.secondaryButtonTextAr || t.viewLookbook) : (currentSlide?.secondaryButtonTextEn || t.viewLookbook);
  const secondaryButtonLink = currentSlide?.secondaryButtonLink || '/collections/new-arrivals';

  const desktopImg = currentSlide?.desktopImageUrl || currentSlide?.mobileImageUrl || '';
  const mobileImg = currentSlide?.mobileImageUrl || desktopImg;

  return (
    <section
      className="relative w-full min-h-[82vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden bg-zinc-950 text-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Responsive Media with Crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slides.map((slide, index) => {
          const sDesktop = slide.desktopImageUrl || slide.mobileImageUrl || desktopImg;
          const sMobile = slide.mobileImageUrl || sDesktop;
          const isActive = index === safeIndex;

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <picture>
                <source media="(max-width: 640px)" srcSet={sMobile} />
                <img
                  src={sDesktop}
                  alt={slide.titleEn || 'EIFFEL Hero'}
                  className={`w-full h-full object-cover object-center transition-transform duration-10000 ease-out ${
                    isActive ? 'scale-105 opacity-60' : 'scale-100 opacity-0'
                  }`}
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/70" />
            </div>
          );
        })}
      </div>

      {/* Hero Editorial Content */}
      <div className="relative z-20 max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 py-12 sm:py-20 w-full flex flex-col justify-end min-h-[82vh] sm:min-h-[88vh]">
        <div className="max-w-4xl xl:max-w-5xl">
          <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
            <span className="inline-flex items-center gap-1.5 bg-white text-black font-bold text-[11px] sm:text-xs tracking-wider px-3 py-1 rounded-full uppercase shadow-md animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{tag}</span>
            </span>
            {currentSlide.discountCode && (
              <span className="hidden sm:inline-block bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">
                CODE: {currentSlide.discountCode}
              </span>
            )}
          </div>

          <h1
            key={`title-${currentSlide.id || safeIndex}`}
            className={`text-white drop-shadow-md animate-fade-in ${
              isRTL
                ? 'font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-snug sm:leading-[1.18] tracking-normal'
                : 'font-editorial font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight uppercase'
            }`}
          >
            {title}
          </h1>

          <p
            key={`sub-${currentSlide.id || safeIndex}`}
            className="text-xs sm:text-base md:text-lg text-zinc-200 mt-4 sm:mt-5 max-w-2xl leading-relaxed font-light drop-shadow animate-fade-in"
          >
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link
              to={buttonLink}
              onClick={handleCtaClick}
              className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 bg-white text-black font-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl group cursor-pointer rounded-sm"
            >
              <span>{buttonText}</span>
              <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Link>

            {secondaryButtonText && (
              <Link
                to={secondaryButtonLink}
                onClick={handleCtaClick}
                className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 bg-black/40 backdrop-blur-md border border-white/40 text-white font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all text-center cursor-pointer rounded-sm"
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Hero Metadata & Slide Controls */}
        <div className="mt-10 sm:mt-16 pt-4 sm:pt-6 border-t border-white/20 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] sm:text-xs font-mono text-zinc-400 gap-4">
          <div className="flex items-center gap-4">
            <div>{t.heroCampaign}</div>
            <span className="hidden sm:inline">•</span>
            <div className="hidden sm:block">{t.heroLocation}</div>
          </div>

          {/* Slider Pagination Controls */}
          {slides.length > 1 && (
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={handlePrev}
                aria-label="Previous slide"
                className="w-8 h-8 rounded-full border border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`h-1.5 transition-all rounded-full cursor-pointer ${
                      idx === safeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                aria-label="Next slide"
                className="w-8 h-8 rounded-full border border-white/30 hover:border-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
