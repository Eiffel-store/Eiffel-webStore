import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { useCurrency } from '@/shared';
import { useLanguage } from '@/shared';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = query.trim() === ''
    ? []
    : PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.subCategory.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4);

  const handleSelectProduct = (productId: string) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/collections/men?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex flex-col justify-start max-w-4xl mx-auto px-4 sm:px-8 pt-20 pb-12 z-10">
        {/* Search Header Form */}
        <div className="flex items-center justify-between border-b-2 border-white pb-4 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-3">
            <Search className="w-6 h-6 text-white shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isRTL ? "ابحث بالاسم، القماش، أو الفئة..." : "SEARCH BY SILHOUETTE, FABRIC, OR CATEGORY..."}
              className="w-full bg-transparent text-white font-editorial text-2xl sm:text-4xl uppercase focus:outline-none placeholder:text-zinc-500 tracking-wider"
            />
          </form>

          <button
            onClick={onClose}
            className="p-2 text-white hover:opacity-70 transition-opacity"
            aria-label="Close search"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Live Search Results */}
        {query.trim() !== '' && (
          <div className="bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center text-xs font-mono text-secondary dark:text-zinc-400 uppercase">
              <span>{t.showingSilhouettes} ({filteredProducts.length})</span>
              {filteredProducts.length > 0 && (
                <button
                  onClick={handleSearchSubmit}
                  className="hover:underline flex items-center gap-1 text-primary dark:text-white"
                >
                  <span>{t.viewAll}</span>
                  <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-secondary dark:text-zinc-400 font-mono">
                {t.noPiecesFound}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="flex gap-4 p-3 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 hover:border-primary cursor-pointer transition-all group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-20 object-cover bg-zinc-950"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-secondary dark:text-zinc-400 uppercase">
                          {product.subCategory}
                        </span>
                        <h4 className="font-editorial text-lg text-primary dark:text-white group-hover:underline line-clamp-1">
                          {product.name}
                        </h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-primary dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Suggestion Tags */}
        <div className="mt-8 text-white">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block mb-3">
            {isRTL ? 'كلمات بحث مقترحة:' : 'FREQUENTLY SEARCHED:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'Monolith Trench',
              '700GSM Loopwheel',
              'Double-Breasted',
              'Wakayama Cotton',
              'Oversized Hoodie',
              'Virgin Wool'
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3.5 py-1.5 bg-zinc-900/80 border border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white hover:border-white transition-colors uppercase"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
