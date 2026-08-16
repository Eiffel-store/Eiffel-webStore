import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  Ruler,
  ChevronDown,
  ChevronUp,
  Star,
  Check,
  ArrowRight,
  Share2
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Noir');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(0);
    setSelectedSize(product.sizes[0] || 'M');
    setSelectedColor(product.colors[0]?.name || 'Noir');
  }, [id, product]);

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleAccordion = (name: string) => {
    setActiveAccordion(prev => (prev === name ? null : name));
  };

  // Recommended products
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.subCategory === product.subCategory)).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Breadcrumb Navigation */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 py-4 border-b border-surface-container dark:border-zinc-800 text-xs font-mono text-secondary dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:underline">EIFFEL</Link>
          <span>/</span>
          <Link to={`/collections/${product.category}`} className="hover:underline uppercase">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-primary dark:text-white truncate uppercase">{product.name}</span>
        </div>
      </div>

      {/* Main PDP Layout */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] w-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 overflow-hidden group">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center cursor-zoom-in group-hover:scale-105 transition-transform duration-700"
              />

              {/* Tag Overlays */}
              <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex flex-col gap-1.5">
                {product.isNew && (
                  <span className="bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest px-3 py-1 uppercase">
                    {t.newBadge}
                  </span>
                )}
                {product.tag && (
                  <span className="bg-surface-container-lowest/90 dark:bg-zinc-900/90 text-primary dark:text-white font-label-bold text-[10px] tracking-wider px-2.5 py-1 uppercase border border-surface-container dark:border-zinc-700">
                    {product.tag}
                  </span>
                )}
              </div>

              {/* Share & Wishlist quick actions on image */}
              <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-surface-container dark:border-zinc-700 hover:scale-105 transition-all ${
                    isSaved ? 'text-error' : 'text-primary dark:text-white'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-error' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-surface-container dark:border-zinc-700 hover:scale-105 text-primary dark:text-white transition-all relative"
                  title="Share link"
                >
                  <Share2 className="w-5 h-5" />
                  {copiedLink && (
                    <span className="absolute right-full rtl:right-auto rtl:left-full mr-2 rtl:mr-0 rtl:ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] font-mono whitespace-nowrap">
                      COPIED
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-[4/5] overflow-hidden border transition-all ${
                      selectedImage === idx
                        ? 'border-primary dark:border-white ring-2 ring-primary dark:ring-white'
                        : 'border-surface-container dark:border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Sticky Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              {/* Reference ID & Category */}
              <div className="flex items-center justify-between text-xs font-mono text-secondary dark:text-zinc-400 uppercase">
                <span>{t.refNumber} {product.id.toUpperCase()}</span>
                <span>{t.madeInItaly}</span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white mt-2 leading-[0.95]">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-secondary dark:text-zinc-300 mt-2 font-light">
                {product.subtitle}
              </p>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mt-6 pb-6 border-b border-surface-container dark:border-zinc-800">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-bold text-primary dark:text-white">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm font-mono text-secondary line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-secondary dark:text-zinc-400">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-mono">({product.reviewCount})</span>
                </div>
              </div>

              {/* Color Swatches */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase mb-2.5">
                  <span>{t.colorway} <strong className="text-primary dark:text-white">{selectedColor}</strong></span>
                </div>
                <div className="flex gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-4 py-2 border text-xs font-label-bold uppercase transition-all ${
                        selectedColor === c.name
                          ? 'border-primary dark:border-white bg-surface-container-high dark:bg-zinc-800 text-primary dark:text-white'
                          : 'border-surface-container dark:border-zinc-800 text-secondary hover:border-secondary'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/30" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase mb-2.5">
                  <span>{t.selectSize}</span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center gap-1 text-primary dark:text-white hover:underline text-[11px]"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{t.sizeGuide}</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-3 text-xs font-label-bold border transition-all text-center uppercase ${
                        selectedSize === sz
                          ? 'bg-primary text-white dark:bg-white dark:text-black border-primary dark:border-white'
                          : 'border-surface-container dark:border-zinc-800 hover:border-primary text-primary dark:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500 font-mono mt-2">
                  {t.inStockNotice}
                </p>
              </div>

              {/* Quantity & Purchasing CTA Buttons */}
              <div className="mt-8 space-y-3">
                <div className="flex gap-3">
                  <div className="flex items-center border border-surface-container dark:border-zinc-700 bg-surface-container-low dark:bg-zinc-900 px-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-primary dark:text-white px-2 py-3 hover:opacity-60"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-bold px-3 text-primary dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-primary dark:text-white px-2 py-3 hover:opacity-60"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-md"
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span>{t.addedToBag}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t.addToBag}</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-secondary text-white dark:bg-zinc-800 dark:text-zinc-200 font-label-bold text-xs tracking-widest uppercase hover:bg-primary dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>{t.expressCheckout}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Guarantees Bar */}
              <div className="mt-8 pt-6 border-t border-surface-container dark:border-zinc-800 grid grid-cols-2 gap-4 text-xs text-secondary dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary dark:text-white" />
                  <span>{t.footerTrustShippingTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-primary dark:text-white" />
                  <span>{t.returnsNotice}</span>
                </div>
              </div>
            </div>

            {/* Accordion Specs */}
            <div className="divide-y divide-surface-container dark:divide-zinc-800 border-y border-surface-container dark:border-zinc-800">
              {/* 1. Structural Details */}
              <div>
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full py-4 flex justify-between items-center text-xs font-label-bold text-primary dark:text-white uppercase tracking-wider text-left rtl:text-right"
                >
                  <span>{t.specsCraftsmanship}</span>
                  {activeAccordion === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'details' && (
                  <div className="pb-4 text-xs text-secondary dark:text-zinc-300 leading-relaxed font-light animate-fade-in">
                    <p className="mb-3">{product.description}</p>
                    <ul className="list-disc list-inside space-y-1.5 font-normal">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 2. Fabric & Composition */}
              <div>
                <button
                  onClick={() => toggleAccordion('fabric')}
                  className="w-full py-4 flex justify-between items-center text-xs font-label-bold text-primary dark:text-white uppercase tracking-wider text-left rtl:text-right"
                >
                  <span>{t.specsFabric}</span>
                  {activeAccordion === 'fabric' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'fabric' && (
                  <div className="pb-4 text-xs text-secondary dark:text-zinc-300 leading-relaxed font-light animate-fade-in space-y-2">
                    <p><strong>{t.composition}</strong> {product.composition}</p>
                    <p><strong>{t.dyeingProcess}</strong> {isRTL ? 'صباغة تفاعلية منخفضة التأثير البيئي مع تثبيت بالمياه الباردة في ميلانو.' : 'Low-impact reactive dye with cold water fixation in Milan.'}</p>
                    <div>
                      <strong>{t.garmentCare}</strong>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {product.care.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Sizing & Fit */}
              <div>
                <button
                  onClick={() => toggleAccordion('fit')}
                  className="w-full py-4 flex justify-between items-center text-xs font-label-bold text-primary dark:text-white uppercase tracking-wider text-left rtl:text-right"
                >
                  <span>{t.specsFit}</span>
                  {activeAccordion === 'fit' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {activeAccordion === 'fit' && (
                  <div className="pb-4 text-xs text-secondary dark:text-zinc-300 leading-relaxed font-light animate-fade-in">
                    <p>{product.fit}</p>
                    <p className="mt-2 text-primary dark:text-white font-mono">
                      {t.modelDimensions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like Carousel */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-12 border-t border-surface-container dark:border-zinc-800">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
                  {t.stylistRecommendations}
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl text-primary dark:text-white mt-1">
                  {t.completeTheLook}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sizing Matrix Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSizeGuide(false)}
          />
          <div className="relative bg-surface-container-lowest dark:bg-zinc-950 w-full max-w-2xl p-6 sm:p-8 border border-surface-container dark:border-zinc-800 shadow-2xl z-10 animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-surface-container dark:border-zinc-800">
              <h3 className="font-editorial text-2xl text-primary dark:text-white">
                {t.measurementMatrix}
              </h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-primary dark:text-white">
                ✕
              </button>
            </div>

            <div className="py-6 overflow-x-auto">
              <table className="w-full text-xs font-mono text-left rtl:text-right">
                <thead>
                  <tr className="border-b border-surface-container dark:border-zinc-800 text-secondary">
                    <th className="py-2">{t.size}</th>
                    <th className="py-2">CHEST / الصدر (CM)</th>
                    <th className="py-2">SHOULDER / الأكتاف (CM)</th>
                    <th className="py-2">LENGTH / الطول (CM)</th>
                    <th className="py-2">SLEEVE / الأكمام (CM)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60 dark:divide-zinc-800">
                  <tr><td className="py-2.5 font-bold">XS</td><td>110</td><td>54</td><td>71</td><td>24</td></tr>
                  <tr><td className="py-2.5 font-bold">S</td><td>116</td><td>56</td><td>73</td><td>25</td></tr>
                  <tr><td className="py-2.5 font-bold">M</td><td>122</td><td>58</td><td>75</td><td>26</td></tr>
                  <tr><td className="py-2.5 font-bold">L</td><td>128</td><td>60</td><td>77</td><td>27</td></tr>
                  <tr><td className="py-2.5 font-bold">XL</td><td>134</td><td>62</td><td>79</td><td>28</td></tr>
                  <tr><td className="py-2.5 font-bold">XXL</td><td>140</td><td>64</td><td>81</td><td>29</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-secondary dark:text-zinc-400 font-light">
              {t.measurementsFlatNotice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
