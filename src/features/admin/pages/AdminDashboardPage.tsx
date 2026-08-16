import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Tag,
  MapPin,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  ExternalLink,
  DollarSign,
  Users,
  Eye,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react';
import { useStoreData } from '@/shared';
import { useLanguage } from '@/shared';
import { useCurrency } from '@/shared';

export const AdminDashboardPage: React.FC = () => {
  const { products, stores, coupons, orders, categories, settings } = useStoreData();
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const offersCount = products.filter(p => p.originalPrice && p.originalPrice > p.price).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing');

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
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

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              {isRTL ? 'إجمالي المنتجات' : 'Total Products'}
            </span>
            <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-editorial font-bold text-white">{totalProducts}</span>
            <span className="text-xs text-emerald-400 font-mono">
              {inStockProducts} {isRTL ? 'متوفر' : 'in stock'}
            </span>
          </div>
          {outOfStockProducts > 0 && (
            <div className="mt-2 text-[11px] text-amber-400 flex items-center gap-1 font-mono">
              <AlertTriangle className="w-3 h-3" />
              <span>{outOfStockProducts} {isRTL ? 'قطع نفدت' : 'out of stock'}</span>
            </div>
          )}
          <Link to="/admin/products" className="mt-3 block text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
            <span>{isRTL ? 'عرض الكتالوج' : 'View Catalog'}</span>
            <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* Active Offers */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              {isRTL ? 'العروض والتخفيضات' : 'Active Offers'}
            </span>
            <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded">
              <Tag className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-editorial font-bold text-white">{offersCount}</span>
            <span className="text-xs text-amber-400 font-mono">
              {coupons.filter(c => c.isActive).length} {isRTL ? 'كوبونات نشطة' : 'coupons'}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500 font-mono">
            {isRTL ? 'قسم العروض في المتجر' : 'Active on /offers collection'}
          </p>
          <Link to="/admin/offers" className="mt-3 block text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
            <span>{isRTL ? 'إدارة العروض' : 'Manage Offers'}</span>
            <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* Branches */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              {isRTL ? 'فروع المتجر' : 'Store Branches'}
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
            {isRTL ? 'محافظة الغربية (زفتى / نهطاي)' : 'Gharbia Governorate'}
          </p>
          <Link to="/admin/branches" className="mt-3 block text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
            <span>{isRTL ? 'تعديل الفروع' : 'Edit Branches'}</span>
            <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* Orders & Revenue */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 shadow-lg relative overflow-hidden group hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              {isRTL ? 'إجمالي الطلبات' : 'Orders & Revenue'}
            </span>
            <div className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded">
              <Package className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-editorial font-bold text-white">{orders.length}</span>
            <span className="text-xs text-blue-400 font-mono">
              {pendingOrders.length} {isRTL ? 'قيد المتابعة' : 'pending'}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-emerald-400 font-mono font-bold">
            {formatPrice(totalRevenue)}
          </p>
          <Link to="/admin/orders" className="mt-3 block text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
            <span>{isRTL ? 'سجل الطلبات' : 'View Orders'}</span>
            <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
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

      {/* Two Columns: Recent Orders & Catalog Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Recent Orders Section */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-white">{isRTL ? 'أحدث الطلبات الواردة' : 'Recent Customer Orders'}</h2>
              <p className="text-xs text-zinc-500">{isRTL ? 'الطلبات التي تم إجراؤها من صفحة الدفع' : 'Orders received from checkout'}</p>
            </div>
            <Link to="/admin/orders" className="text-xs text-zinc-400 hover:text-white font-mono flex items-center gap-1">
              <span>{isRTL ? 'عرض الكل' : 'View All'}</span>
              <ArrowRight className={`w-3 h-3 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>{isRTL ? 'لا توجد طلبات مسجلة حتى الآن.' : 'No customer orders placed yet.'}</p>
              <p className="text-[11px] text-zinc-600 mt-1">{isRTL ? 'ستظهر هنا فور إتمام العميل للطلب في المتجر.' : 'Orders from checkout will appear here live.'}</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-white">{order.id}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : order.status === 'Processing' || order.status === 'Pending'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">
                      {order.shippingAddress?.firstName} {order.shippingAddress?.lastName} — {order.shippingAddress?.city}
                    </p>
                  </div>

                  <div className="text-right rtl:text-left shrink-0">
                    <div className="font-mono text-xs font-bold text-white">{formatPrice(order.total)}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{order.items?.length || 0} {isRTL ? 'قطع' : 'items'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Catalog Preview */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 p-6 shadow-xl space-y-4">
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
      </div>
    </div>
  );
};
