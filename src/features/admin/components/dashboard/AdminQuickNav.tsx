import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Tag, MapPin, Package, TrendingUp, LayoutTemplate } from 'lucide-react';
import { useStoreData, useLanguage } from '@/shared';

export const AdminQuickNav: React.FC = () => {
  const { products, stores, orders } = useStoreData();
  const { t } = useLanguage();
  const offersCount = products.filter(p => p.originalPrice && p.originalPrice > p.price).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
      <Link
        to="/admin/products"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-zinc-400 group-hover:text-white group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{t.adminProducts}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{products.length} {t.items}</div>
      </Link>

      <Link
        to="/admin/products/new"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <Plus className="w-6 h-6 mx-auto mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{t.adminAddProduct}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{t.newBadge}</div>
      </Link>

      <Link
        to="/admin/home"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-amber-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <LayoutTemplate className="w-6 h-6 mx-auto mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{t.adminHomeBanners}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{t.adminCustomize}</div>
      </Link>

      <Link
        to="/admin/offers"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <Tag className="w-6 h-6 mx-auto mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{t.adminOffers}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{offersCount} {t.activeSelection}</div>
      </Link>

      <Link
        to="/admin/branches"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <MapPin className="w-6 h-6 mx-auto mb-2 text-red-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{t.adminBranches}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{stores.length} {t.adminLocationsCount}</div>
      </Link>

      <Link
        to="/admin/orders"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <Package className="w-6 h-6 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{t.adminOrders}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{orders.length} {t.orders}</div>
      </Link>

      <Link
        to="/admin/settings"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{t.adminSettings}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{t.adminAndBackup}</div>
      </Link>
    </div>
  );
};
