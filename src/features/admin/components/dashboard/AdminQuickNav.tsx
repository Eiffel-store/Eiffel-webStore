import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, Tag, MapPin, Package, TrendingUp, LayoutTemplate } from 'lucide-react';
import { useStoreData, useLanguage } from '@/shared';

export const AdminQuickNav: React.FC = () => {
  const { products, stores, orders } = useStoreData();
  const { isRTL } = useLanguage();
  const offersCount = products.filter(p => p.originalPrice && p.originalPrice > p.price).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
      <Link
        to="/admin/products"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-zinc-400 group-hover:text-white group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{isRTL ? 'المنتجات' : 'Products'}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{products.length} {isRTL ? 'منتج' : 'items'}</div>
      </Link>

      <Link
        to="/admin/products/new"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <Plus className="w-6 h-6 mx-auto mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{isRTL ? 'إضافة منتج' : 'Add Item'}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{isRTL ? 'جديد' : 'New piece'}</div>
      </Link>

      <Link
        to="/admin/home"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-amber-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <LayoutTemplate className="w-6 h-6 mx-auto mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{isRTL ? 'بانرات الهوم' : 'Home Banners'}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{isRTL ? 'تخصيص' : 'Customize'}</div>
      </Link>

      <Link
        to="/admin/offers"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <Tag className="w-6 h-6 mx-auto mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{isRTL ? 'العروض' : 'Offers'}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{offersCount} {isRTL ? 'عرض' : 'active'}</div>
      </Link>

      <Link
        to="/admin/branches"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <MapPin className="w-6 h-6 mx-auto mb-2 text-red-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{isRTL ? 'الفروع' : 'Branches'}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{stores.length} {isRTL ? 'فروع' : 'locations'}</div>
      </Link>

      <Link
        to="/admin/orders"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <Package className="w-6 h-6 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{isRTL ? 'الطلبات' : 'Orders'}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{orders.length} {isRTL ? 'طلب' : 'orders'}</div>
      </Link>

      <Link
        to="/admin/settings"
        className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 text-center rounded transition-all group"
      >
        <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
        <div className="text-xs font-bold text-zinc-200">{isRTL ? 'الإعدادات' : 'Settings'}</div>
        <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{isRTL ? 'والنسخ الاحتياطي' : '& Backup'}</div>
      </Link>
    </div>
  );
};
