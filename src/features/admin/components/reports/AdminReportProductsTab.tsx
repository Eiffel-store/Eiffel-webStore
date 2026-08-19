import React from 'react';
import {
  ShoppingBag,
  TrendingUp,
  AlertOctagon,
  Sparkles,
  Scissors,
  Palette
} from 'lucide-react';
import { useLanguage, useCurrency } from '@/shared';
import { Order, Product } from '@/types';

interface AdminReportProductsTabProps {
  orders: Order[];
  products: Product[];
}

export const AdminReportProductsTab: React.FC<AdminReportProductsTabProps> = ({
  orders,
  products
}) => {
  const { isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  // 1. Detailed Product Analytics
  const productStats = React.useMemo(() => {
    const map: Record<string, { product?: Product; name: string; qty: number; revenue: number; image?: string; stock: number }> = {};

    products.forEach((p) => {
      map[p.id] = {
        product: p,
        name: p.name,
        qty: 0,
        revenue: 0,
        image: p.images?.[0],
        stock: p.stock !== undefined ? p.stock : 20
      };
    });

    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      o.items?.forEach((item) => {
        const prod = item.product || (item as any);
        const pId = prod?.id || prod?.name || 'item';
        if (!map[pId]) {
          map[pId] = {
            product: prod,
            name: prod?.name || 'Item',
            qty: 0,
            revenue: 0,
            image: prod?.images?.[0] || (prod as any)?.image,
            stock: prod?.stock !== undefined ? prod.stock : 0
          };
        }
        const qty = item.quantity || 1;
        const price = prod?.price || (item as any)?.price || 0;
        map[pId].qty += qty;
        map[pId].revenue += price * qty;
      });
    });

    const all = Object.values(map);
    const sortedBySales = [...all].sort((a, b) => b.qty - a.qty);
    const deadStock = all.filter((p) => p.qty === 0 && p.stock > 0);

    return {
      topSelling: sortedBySales.slice(0, 8),
      deadStock: deadStock.slice(0, 6),
      all
    };
  }, [orders, products]);

  // 2. Size Demand Analysis (S, M, L, XL, XXL)
  const sizeStats = React.useMemo(() => {
    const sizeMap: Record<string, number> = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
    let totalItems = 0;

    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      o.items?.forEach((item) => {
        const sz = item.selectedSize || 'M';
        sizeMap[sz] = (sizeMap[sz] || 0) + (item.quantity || 1);
        totalItems += item.quantity || 1;
      });
    });

    const total = totalItems || 1;
    return Object.entries(sizeMap).map(([size, count]) => ({
      size,
      count,
      percent: Math.round((count / total) * 100)
    }));
  }, [orders]);

  // 3. Color Demand Analysis
  const colorStats = React.useMemo(() => {
    const colorMap: Record<string, number> = {};
    let totalItems = 0;

    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      o.items?.forEach((item) => {
        const col = item.selectedColor || (isRTL ? 'أسود معماري (Noir)' : 'Architectural Noir');
        colorMap[col] = (colorMap[col] || 0) + (item.quantity || 1);
        totalItems += item.quantity || 1;
      });
    });

    const total = totalItems || 1;
    return Object.entries(colorMap)
      .map(([color, count]) => ({
        color,
        count,
        percent: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders, isRTL]);

  return (
    <div className="space-y-6">
      {/* 1. Best Sellers Performance Table */}
      <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              {isRTL ? 'جدول أداء المنتجات ومعدل دوران المبيعات' : 'Product Sales Velocity & Revenue Matrix'}
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">{productStats.topSelling.length} {isRTL ? 'قطع رائدة' : 'items'}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>#</th>
                <th className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'المنتج' : 'Product'}</th>
                <th className="p-3 text-center">{isRTL ? 'الكمية المباعة' : 'Units Sold'}</th>
                <th className="p-3 text-center">{isRTL ? 'المخزون المتبقي' : 'In Stock'}</th>
                <th className={`p-3 ${isRTL ? 'text-left' : 'text-right'}`}>{isRTL ? 'إجمالي الدخل' : 'Gross Revenue'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {productStats.topSelling.map((item, idx) => (
                <tr key={`prod-row-${idx}`} className="hover:bg-zinc-900/40 transition-colors">
                  <td className={`p-3 font-bold text-amber-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                    #{idx + 1}
                  </td>
                  <td className={`p-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover border border-zinc-800 bg-zinc-900 shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-sans font-medium text-white line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-zinc-500">{item.product?.category || 'Collection'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center font-bold text-white">
                    {item.qty} {isRTL ? 'قطعة' : 'pcs'}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.stock <= 5 ? 'bg-amber-400/10 text-amber-400' : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {item.stock} {isRTL ? 'متبقي' : 'left'}
                    </span>
                  </td>
                  <td className={`p-3 font-bold text-emerald-400 ${isRTL ? 'text-left' : 'text-right'}`}>
                    {formatPrice(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Sizing & Color Demand Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Size Demand */}
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                {isRTL ? 'تفضيلات المقاسات الأكثر طلباً' : 'Size Demand & Popularity'}
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{isRTL ? 'قصات إيفل' : 'Eiffel Sizing'}</span>
          </div>

          <div className="space-y-4">
            {sizeStats.map((sz, idx) => (
              <div key={`sz-${idx}`} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-white">
                      {sz.size}
                    </span>
                    <span className="text-zinc-400">{sz.count} {isRTL ? 'قطعة مطلوبة' : 'ordered'}</span>
                  </div>
                  <span className="text-blue-400 font-bold">{sz.percent}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, sz.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Demand */}
        <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                {isRTL ? 'تفضيلات ألوان التشكيلات' : 'Colorway Demand Analysis'}
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">{colorStats.length} {isRTL ? 'ألوان' : 'colorways'}</span>
          </div>

          <div className="space-y-4">
            {colorStats.map((col, idx) => (
              <div key={`col-${idx}`} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-200 font-medium truncate max-w-[200px]">{col.color}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400">{col.count} {isRTL ? 'قطعة' : 'sold'}</span>
                    <span className="text-amber-400 font-bold">{col.percent}%</span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, col.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Dead Stock / Slow Moving Inventory Alert */}
      {productStats.deadStock.length > 0 && (
        <div className="p-6 rounded-xl bg-zinc-950 border border-amber-500/20 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertOctagon className="w-4 h-4" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider">
                {isRTL ? 'المنتجات الراكدة والمخزون بطيء الحركة' : 'Slow-Moving / Idle Inventory Diagnostics'}
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {isRTL ? 'اقتراح: إطلاق عروض تخفيض أو كوبونات لتسريع التصريف' : 'Action: Apply discount promo'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {productStats.deadStock.map((item, idx) => (
              <div key={`dead-${idx}`} className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover border border-zinc-800 bg-zinc-900 shrink-0" />
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-white truncate">{item.name}</p>
                    <p className="text-[10px] text-zinc-500 font-mono">{formatPrice(item.product?.price || 0)}</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] font-mono text-amber-300 font-bold shrink-0">
                  {item.stock} {isRTL ? 'بالمخزن' : 'in stock'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
