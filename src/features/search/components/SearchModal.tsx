import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useStoreData, useCurrency, useLanguage } from '@/shared';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { products = [] } = useStoreData();
  const { formatPrice } = useCurrency();
  const { isRTL } = useLanguage();

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
    : (products || []).filter(
        (p) =>
          p && (
            (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
            (p.subtitle && p.subtitle.toLowerCase().includes(query.toLowerCase())) ||
            (p.category && p.category.toLowerCase().includes(query.toLowerCase())) ||
            (p.subCategory && p.subCategory.toLowerCase().includes(query.toLowerCase()))
          )
      ).slice(0, 6);

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-down">
        {/* Search Header Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center p-4 border-b border-surface-container dark:border-zinc-800">
          <Search className="w-5 h-5 text-secondary dark:text-zinc-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isRTL ? 'ابحث عن معطف، قميص، بدلة، حذاء...' : 'Search bespoke overcoats, tailored suits, accessories...'}
            autoFocus
            className="flex-1 bg-transparent px-4 text-sm text-primary dark:text-white placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-secondary dark:text-zinc-400 hover:text-primary dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-xs text-zinc-400 font-mono">
              {isRTL ? 'اكتب كلمة البحث لاستعراض الكتالوج المباشر' : 'Type keywords to search live catalog'}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-400 font-mono">
              {isRTL ? 'لم يتم العثور على قطع مطابقة' : 'No matching pieces found'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredProducts.map((p) => {
                const img = p?.images?.[0] || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop';
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p.id)}
                    className="flex items-center gap-3 p-2.5 bg-surface-container-low dark:bg-zinc-900 border border-surface-container dark:border-zinc-800 hover:border-primary dark:hover:border-white cursor-pointer transition-colors"
                  >
                    <img src={img} alt={p.name || 'Product'} className="w-12 h-16 object-cover bg-zinc-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-primary dark:text-white truncate">{p.name}</h4>
                      <p className="text-[11px] text-zinc-400 truncate">{p.subtitle}</p>
                      <p className="text-[11px] font-mono font-bold text-primary dark:text-white mt-0.5">{formatPrice(p.price || 0)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
