import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Tag, MapPin, Package, AlertTriangle, ArrowRight } from 'lucide-react';
import { useStoreData, useLanguage, useCurrency } from '@/shared';

export const AdminStatCards: React.FC = () => {
  const { products, stores, coupons, orders } = useStoreData();
  const { isRTL, t } = useLanguage();
  const { formatPrice } = useCurrency();

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const offersCount = products.filter(p => p.originalPrice && p.originalPrice > p.price).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Total Products */}
      <div className="bg-zinc-950 border border-zinc-800 p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            {t.adminTotalProducts}
          </span>
          <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-editorial font-bold text-white">{totalProducts}</span>
          <span className="text-xs text-emerald-400 font-mono">
            {inStockProducts} {t.adminInStock}
          </span>
        </div>
        {outOfStockProducts > 0 && (
          <div className="mt-2 text-[11px] text-amber-400 flex items-center gap-1 font-mono">
            <AlertTriangle className="w-3 h-3" />
            <span>{outOfStockProducts} {t.adminOutOfStock}</span>
          </div>
        )}
        <Link to="/admin/products" className="mt-3 block text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
          <span>{t.adminViewCatalog}</span>
          <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>

      {/* Active Offers */}
      <div className="bg-zinc-950 border border-zinc-800 p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            {t.adminActiveOffers}
          </span>
          <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded">
            <Tag className="w-4 h-4 text-amber-400" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-editorial font-bold text-white">{offersCount}</span>
          <span className="text-xs text-amber-400 font-mono">
            {coupons.filter(c => c.isActive).length} {t.adminActiveCoupons}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-zinc-500 font-mono">
          {t.adminOffersSection}
        </p>
        <Link to="/admin/offers" className="mt-3 block text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
          <span>{t.adminManageOffers}</span>
          <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>

      {/* Branches */}
      <div className="bg-zinc-950 border border-zinc-800 p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            {t.adminStoreBranches}
          </span>
          <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded">
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-editorial font-bold text-white">{stores.length}</span>
          <span className="text-xs text-zinc-400 font-mono">
            {stores.map(s => s.name.split('—')[1] || s.city).join(', ')}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-zinc-500 font-mono">
          {t.adminGharbiaBranches}
        </p>
        <Link to="/admin/branches" className="mt-3 block text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
          <span>{t.adminEditBranches}</span>
          <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>

      {/* Orders & Revenue */}
      <div className="bg-zinc-950 border border-zinc-800 p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            {t.adminOrders}
          </span>
          <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded">
            <Package className="w-4 h-4 text-blue-400" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-editorial font-bold text-white">{orders.length}</span>
          <span className="text-xs text-blue-400 font-mono">
            {pendingOrders.length} {t.adminFilterPending}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-emerald-400 font-mono font-bold">
          {formatPrice(totalRevenue)}
        </p>
        <Link to="/admin/orders" className="mt-3 block text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
          <span>{t.adminHeaderOrders}</span>
          <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    </div>
  );
};
