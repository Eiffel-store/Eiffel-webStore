import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Check } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductInfo } from '../components/product/ProductInfo';
import { ProductAccordion } from '../components/product/ProductAccordion';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useStoreData } from '../context/StoreDataContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { products, getProductById } = useStoreData();

  const product = (id ? getProductById(id) : undefined) || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Noir');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

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

  const toggleAccordion = (name: string) => {
    setActiveAccordion(prev => (prev === name ? null : name));
  };

  // Recommended products
  const relatedProducts = products.filter(
    p => p.id !== product.id && (p.category === product.category || p.subCategory === product.subCategory)
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20 sm:pb-0">
      {/* Breadcrumb Navigation */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-8 md:px-12 py-3 sm:py-4 border-b border-surface-container dark:border-zinc-800 text-[11px] sm:text-xs font-mono text-secondary dark:text-zinc-400">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
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
      <main className="max-w-[1440px] mx-auto px-3 sm:px-8 md:px-12 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          {/* Left Gallery (7 cols) */}
          <ProductGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            isSaved={isSaved}
            onToggleWishlist={() => toggleWishlist(product)}
          />

          {/* Right Sticky Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8">
            <ProductInfo
              product={product}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              quantity={quantity}
              setQuantity={setQuantity}
              addedAnimation={addedAnimation}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onOpenSizeGuide={() => setShowSizeGuide(true)}
            />

            {/* Accordion Specs */}
            <ProductAccordion
              product={product}
              activeAccordion={activeAccordion}
              toggleAccordion={toggleAccordion}
            />
          </div>
        </div>

        {/* You May Also Like Carousel */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-surface-container dark:border-zinc-800">
            <div className="flex justify-between items-end mb-6 sm:mb-8">
              <div>
                <span className="text-[10px] sm:text-xs font-label-bold text-secondary dark:text-zinc-400 uppercase tracking-widest">
                  {t.stylistRecommendations}
                </span>
                <h2 className="font-editorial text-2xl sm:text-4xl text-primary dark:text-white mt-1">
                  {t.completeTheLook}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sizing Matrix Modal */}
      {showSizeGuide && (
        <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
      )}

      {/* Sticky Bottom Mobile Bar for Quick Purchase */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-container-lowest/95 dark:bg-zinc-950/95 backdrop-blur-md p-3 border-t border-surface-container dark:border-zinc-800 shadow-2xl flex items-center justify-between gap-3 animate-fade-in">
        <div className="min-w-0">
          <p className="font-editorial text-sm text-primary dark:text-white truncate">{product.name}</p>
          <span className="font-mono text-xs font-bold text-primary dark:text-white">{formatPrice(product.price)}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="py-3 px-5 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shrink-0 shadow-lg active:scale-95 transition-transform"
        >
          {addedAnimation ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span>{t.addedToBag}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.addToBag}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
