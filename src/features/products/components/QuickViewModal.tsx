import React, { useState } from 'react';
import { X, ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/features/cart';
import { useWishlist } from '@/features/wishlist';
import { useCurrency, resolveColorImage } from '@/shared';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const images = (product.images && product.images.length > 0) ? product.images : ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop'];
  const sizes = product.sizes || ['48 (M)', '50 (L)', '52 (XL)'];
  const colors = product.colors || [{ name: 'Noir', hex: '#000' }];

  const activeColor = selectedColor || colors[0]?.name || 'Standard';
  const activeSize = selectedSize || sizes[0] || 'M';

  const handleAddToCart = () => {
    addToCart(product, activeSize, activeColor, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 w-full max-w-3xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close Quick View"
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-1.5 text-secondary hover:text-primary dark:text-zinc-400 dark:hover:text-white z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery */}
          <div className="flex flex-col bg-zinc-900">
            <div className="relative aspect-[3/4] w-full">
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-2 bg-zinc-950 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-12 h-14 shrink-0 border ${selectedImage === idx ? 'border-white' : 'border-zinc-800 opacity-60'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">{product.category}</span>
              <h2 className="font-editorial text-2xl font-bold text-primary dark:text-white mt-1">{product.name}</h2>
              <p className="text-xs text-secondary dark:text-zinc-400 mt-1">{product.subtitle}</p>
              <div className="mt-3 font-mono text-lg font-bold text-primary dark:text-white">{formatPrice(product.price || 0)}</div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-[11px] font-label-bold uppercase text-zinc-400 mb-1.5">Color: {activeColor}</label>
              <div className="flex gap-2">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedColor(c.name);
                      const targetImg = resolveColorImage(product, c.name);
                      const idx = images.indexOf(targetImg);
                      if (idx !== -1) {
                        setSelectedImage(idx);
                      }
                    }}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${activeColor === c.name ? 'border-primary dark:border-white ring-2 ring-primary' : 'border-zinc-700'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-[11px] font-label-bold uppercase text-zinc-400 mb-1.5">Size: {activeSize}</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 text-xs font-mono border ${activeSize === s ? 'bg-primary text-white dark:bg-white dark:text-black border-primary dark:border-white' : 'border-zinc-700 text-zinc-300'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock status */}
            <div className="text-[11px] font-mono">
              {(product.stock !== undefined ? product.stock : (product.inStock ? 20 : 0)) <= 0 ? (
                <span className="text-rose-400 font-bold">❌ Out of stock</span>
              ) : (product.stock !== undefined ? product.stock : 20) <= 5 ? (
                <span className="text-amber-400 font-bold">⚠️ Only {product.stock} left in stock!</span>
              ) : (
                <span className="text-emerald-400">✓ In Stock ({product.stock ?? 20} available)</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={(product.stock !== undefined ? product.stock : (product.inStock ? 20 : 0)) <= 0}
                className="flex-1 py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-wider uppercase hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {(product.stock !== undefined ? product.stock : (product.inStock ? 20 : 0)) <= 0 ? 'Out of Stock' : 'Add to Bag'}
                </span>
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3 border border-zinc-700 text-zinc-300 hover:text-white cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-red-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
