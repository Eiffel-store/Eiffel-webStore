import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import { useWishlist } from '@/features/wishlist';
import { useCart } from '@/features/cart';
import { useCurrency } from '@/shared';
import { useLanguage } from '@/shared';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-on-surface py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between pb-6 border-b border-surface-container dark:border-zinc-800">
          <div>
            <span className="text-xs font-mono text-secondary dark:text-zinc-400 uppercase tracking-widest">
              {t.savedSilhouettes}
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl text-primary dark:text-white mt-1">
              {t.wishlistTitle} ({wishlist.length})
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-label-bold text-error hover:underline uppercase"
            >
              {t.clearAllSaved}
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 flex items-center justify-center mx-auto mb-4 text-secondary">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-editorial text-3xl text-primary dark:text-white mb-2">
              {t.noSavedPieces}
            </h2>
            <p className="text-xs text-secondary dark:text-zinc-400 max-w-md mx-auto mb-8 font-light">
              {t.noSavedPiecesDesc}
            </p>
            <Link
              to="/collections/men"
              className="px-8 py-4 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors"
            >
              {t.exploreCollection}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low dark:bg-zinc-900">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover luxury-image-hover"
                    />
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 rtl:right-auto rtl:left-3 p-2 bg-white/90 dark:bg-zinc-900/90 border border-surface-container dark:border-zinc-800 text-error hover:scale-110 transition-transform"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <span className="text-[10px] font-label-bold text-secondary dark:text-zinc-400 uppercase">
                      {product.subCategory}
                    </span>
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="font-editorial text-xl text-primary dark:text-white mt-0.5 line-clamp-1 hover:underline">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="font-mono text-sm font-bold text-primary dark:text-white mt-1">
                      {formatPrice(product.price)}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(product, product.sizes?.[0] || 'M', product.colors?.[0]?.name || 'Noir', 1);
                      removeFromWishlist(product.id);
                    }}
                    className="w-full py-3 bg-primary text-white dark:bg-white dark:text-black font-label-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t.moveToBag}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
