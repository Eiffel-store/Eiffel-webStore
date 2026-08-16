import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/shared';

export const AdminWelcomeBanner: React.FC = () => {
  const { isRTL } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
      <div className="space-y-2 z-10">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[10px] font-mono uppercase tracking-wider rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {isRTL ? 'المتجر متصل ويعمل بنجاح' : 'Storefront Live & Operating'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-wide">
          {isRTL ? 'مرحباً بك في لوحة تحكم إيفل' : 'Welcome to Eiffel Command Center'}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl font-light">
          {isRTL
            ? 'تحكم في كافة المنتجات والأسعار والعروض والفروع والطلبات بكل سهولة وفورية.'
            : 'Directly manage catalog items, branches, offers, categories, and incoming customer orders.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 z-10">
        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors font-label-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>{isRTL ? 'إضافة منتج' : 'Add Product'}</span>
        </Link>
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors text-xs font-medium flex items-center gap-1.5 border border-zinc-700"
        >
          <span>{isRTL ? 'معاينة المتجر' : 'Store Preview'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
