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

  // Fallback slide if no dynamic banners exist in database after load
  const fallbackSlide: Banner = {
    id: 'fallback-hero',
    placement: 'HERO_SLIDER',
    tagEn: settings?.hero?.tagEn || t.heroSeason,
    tagAr: settings?.hero?.tagAr || t.heroSeason,
    titleEn: settings?.hero?.titleEn || t.heroTitle,
    titleAr: settings?.hero?.titleAr || t.heroTitle,
    subtitleEn: settings?.hero?.subtitleEn || t.heroSubtitle,
    subtitleAr: settings?.hero?.subtitleAr || t.heroSubtitle,
    buttonTextEn: settings?.hero?.buttonTextEn || t.exploreCollection,
    buttonTextAr: settings?.hero?.buttonTextAr || t.exploreCollection,
    buttonLink: settings?.hero?.buttonLink || '/collections/men',
    secondaryButtonTextEn: settings?.hero?.secondaryButtonTextEn || t.viewLookbook,
    secondaryButtonTextAr: settings?.hero?.secondaryButtonTextAr || t.viewLookbook,
    secondaryButtonLink: settings?.hero?.secondaryButtonLink || '/collections/new-arrivals',
    desktopImageUrl: settings?.hero?.desktopImageUrl || settings?.hero?.imageUrl || `${import.meta.env.BASE_URL}images/products/eiffel-outfit-flatlay.jpg`,
    mobileImageUrl: settings?.hero?.mobileImageUrl || settings?.hero?.imageUrl || `${import.meta.env.BASE_URL}images/products/eiffel-outfit-flatlay.jpg`,
  };

  const slides: Banner[] = heroBanners.length > 0 ? heroBanners : [fallbackSlide];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackedImpressions = useRef<Set<string>>(new Set());

  // Preload all slider images on mount
  useEffect(() => {
    const urls = slides
      .map(s => s.desktopImageUrl || s.mobileImageUrl)
      .filter((u): u is string => Boolean(u));
    preloadImages(urls);
  }, [slides]);

  // Keep index within range
  const safeIndex = currentSlideIndex >= slides.length ? 0 : currentSlideIndex;
  const currentSlide = slides[safeIndex] || fallbackSlide;

  // Track impression for current slide
  useEffect(() => {
    if (currentSlide?.id && !trackedImpressions.current.has(currentSlide.id) && currentSlide.id !== 'fallback-hero') {
      trackBannerImpression(currentSlide.id);
      trackedImpressions.current.add(currentSlide.id);
    }
  }, [currentSlide, trackBannerImpression]);

  // Autoplay timer
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % slides.length);
    }, 6500);

    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

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

  const tag = isRTL ? (currentSlide.tagAr || t.heroSeason) : (currentSlide.tagEn || t.heroSeason);
  const title = isRTL ? (currentSlide.titleAr || t.heroTitle) : (currentSlide.titleEn || t.heroTitle);
  const subtitle = isRTL ? (currentSlide.subtitleAr || t.heroSubtitle) : (currentSlide.subtitleEn || t.heroSubtitle);
  const buttonText = isRTL ? (currentSlide.buttonTextAr || t.exploreCollection) : (currentSlide.buttonTextEn || t.exploreCollection);
  const buttonLink = currentSlide.buttonLink || '/collections/men';
  const secondaryButtonText = isRTL ? (currentSlide.secondaryButtonTextAr || t.viewLookbook) : (currentSlide.secondaryButtonTextEn || t.viewLookbook);
  const secondaryButtonLink = currentSlide.secondaryButtonLink || '/collections/new-arrivals';

  const desktopImg = currentSlide.desktopImageUrl || currentSlide.mobileImageUrl || `${import.meta.env.BASE_URL}images/products/eiffel-outfit-flatlay.jpg`;
  const mobileImg = currentSlide.mobileImageUrl || desktopImg;

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
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className="inline-flex items-center gap-1.5 bg-white text-black font-label-bold text-[10px] sm:text-xs tracking-widest px-2.5 sm:px-3 py-1 uppercase shadow-md animate-fade-in">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{tag}</span>
            </span>
            {currentSlide.discountCode && (
              <span className="hidden sm:inline-block bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider">
                CODE: {currentSlide.discountCode}
              </span>
            )}
          </div>

          <h1
            key={`title-${currentSlide.id || safeIndex}`}
            className="font-editorial text-4xl sm:text-7xl md:text-8xl lg:text-9xl leading-[1.0] sm:leading-[0.95] tracking-tight text-white uppercase drop-shadow-sm animate-fade-in"
          >
            {title}
          </h1>

          <p
            key={`sub-${currentSlide.id || safeIndex}`}
            className="font-inter text-xs sm:text-base md:text-lg text-zinc-300 mt-4 sm:mt-6 max-w-xl leading-relaxed font-light animate-fade-in"
          >
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link
              to={buttonLink}
              onClick={handleCtaClick}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-label-bold text-xs tracking-widest uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg group cursor-pointer"
            >
              <span>{buttonText}</span>
              <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Link>

            {secondaryButtonText && (
              <Link
                to={secondaryButtonLink}
                onClick={handleCtaClick}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-transparent border border-white text-white font-label-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all text-center cursor-pointer"
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
