import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStoreData, useLanguage, useCurrency } from '@/shared';

export const AdminCatalogPreview: React.FC = () => {
  const { products } = useStoreData();
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-white">{isRTL ? 'منتجات إيفل' : 'Featured Catalog'}</h2>
          <p className="text-xs text-zinc-500">{isRTL ? 'أحدث القطع في المتجر' : 'Latest pieces added'}</p>
        </div>
        <Link to="/admin/products" className="text-xs text-zinc-400 hover:text-white font-mono flex items-center gap-1">
          <span>{isRTL ? 'إدارة الكل' : 'Manage All'}</span>
          <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>

      <div className="space-y-3">
        {products.slice(0, 5).map((p) => (
          <div key={p.id} className="flex items-center gap-3 p-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 transition-colors">
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-12 h-14 object-cover bg-zinc-900 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{p.name}</div>
              <div className="text-[11px] text-zinc-400 font-mono">{formatPrice(p.price)}</div>
            </div>
            <div className="text-right rtl:text-left shrink-0">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 ${
                  p.inStock ? 'text-emerald-400 bg-emerald-950/50' : 'text-red-400 bg-red-950/50'
                }`}
              >
                {p.inStock ? (isRTL ? 'متوفر' : 'In Stock') : (isRTL ? 'نفد' : 'Sold Out')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
