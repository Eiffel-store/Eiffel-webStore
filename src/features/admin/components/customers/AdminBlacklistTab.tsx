import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ShieldAlert, 
  Trash2, 
  Plus, 
  Search, 
  Smartphone, 
  Globe, 
  Laptop, 
  AlertCircle,
  X,
  Loader2,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { blacklistService } from '@/services/blacklistService';
import { BlacklistEntry } from '@/types';
import { useLanguage } from '@/shared';
import toast from 'react-hot-toast';

export const AdminBlacklistTab: React.FC = () => {
  const { t, language } = useLanguage();
  const isAr = language === 'ar';
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  // Manual ban form state
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualIp, setManualIp] = useState('');
  const [manualReason, setManualReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Blacklist
  const { data: entries = [], isLoading, refetch, isFetching } = useQuery<BlacklistEntry[]>({
    queryKey: ['admin', 'blacklist'],
    queryFn: () => blacklistService.getAll(),
  });

  // Filter entries
  const filteredEntries = entries.filter((e) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (e.phone && e.phone.toLowerCase().includes(q)) ||
      (e.email && e.email.toLowerCase().includes(q)) ||
      (e.ip && e.ip.toLowerCase().includes(q)) ||
      (e.deviceFingerprint && e.deviceFingerprint.toLowerCase().includes(q)) ||
      (e.customerName && e.customerName.toLowerCase().includes(q)) ||
      (e.orderId && e.orderId.toLowerCase().includes(q)) ||
      (e.reason && e.reason.toLowerCase().includes(q))
    );
  });

  // Unblock Handler
  const handleUnblock = async (entry: BlacklistEntry) => {
    const identifier = entry.phone || entry.email || entry.ip || entry.id;
    if (!window.confirm(isAr 
      ? `هل أنت متأكد من فك الحظر عن (${identifier}) والسماح له بالشراء مرة أخرى؟` 
      : `Are you sure you want to unblock (${identifier})?`)) {
      return;
    }

    setUnblockingId(entry.id);
    try {
      await blacklistService.delete(entry.id);
      toast.success(isAr ? 'تم فك الحظر بنجاح' : 'Unblocked successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'blacklist'] });
    } catch (err: any) {
      toast.error(err?.message || (isAr ? 'فشل فك الحظر' : 'Failed to unblock'));
    } finally {
      setUnblockingId(null);
    }
  };

  // Add Manual Ban Handler
  const handleAddManualBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPhone.trim() && !manualEmail.trim() && !manualIp.trim()) {
      toast.error(isAr ? 'يرجى إدخال رقم الهاتف أو البريد أو عنوان الـ IP' : 'Please provide a phone, email, or IP address');
      return;
    }

    setIsSubmitting(true);
    try {
      await blacklistService.add({
        phone: manualPhone.trim() || undefined,
        email: manualEmail.trim() || undefined,
        ip: manualIp.trim() || undefined,
        reason: manualReason.trim() || (isAr ? 'حظر يدوي من لوحة التحكم' : 'Manual ban from admin panel'),
      });
      toast.success(isAr ? 'تمت إضافة الحظر بنجاح' : 'Added to blacklist successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'blacklist'] });
      setIsAddModalOpen(false);
      setManualPhone('');
      setManualEmail('');
      setManualIp('');
      setManualReason('');
    } catch (err: any) {
      toast.error(err?.message || (isAr ? 'فشل إضافة الحظر' : 'Failed to add to blacklist'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stats
  const phoneCount = entries.filter(e => !!e.phone).length;
  const ipCount = entries.filter(e => !!e.ip).length;
  const deviceCount = entries.filter(e => !!e.deviceFingerprint).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-red-950/60 border border-red-800/80 rounded-lg text-red-400 mt-1 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{isAr ? 'قائمة الحظر والأمان (Blacklist)' : 'Security Blacklist'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 font-mono">
                {entries.length} {isAr ? 'محظور' : 'blocked'}
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {isAr
                ? 'إدارة الأرقام وعناوين الـ IP والأجهزة المحظورة لمنع الطلبات الوهمية واستنزاف المخزون.'
                : 'Manage blocked phone numbers, IP addresses, and devices to stop spam orders and inventory hijacking.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isAr ? 'تحديث القائمة' : 'Refresh'}
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-red-950/50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة حظر جديد' : 'Add to Blacklist'}</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-lg flex items-center gap-3.5">
          <div className="p-2.5 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-zinc-400 block">{isAr ? 'هواتف محظورة' : 'Blocked Phones'}</span>
            <span className="text-xl font-bold font-mono text-white">{phoneCount}</span>
          </div>
        </div>

        <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-lg flex items-center gap-3.5">
          <div className="p-2.5 bg-blue-950/40 border border-blue-800/60 rounded-lg text-blue-400 shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-zinc-400 block">{isAr ? 'عناوين IP محظورة' : 'Blocked IPs'}</span>
            <span className="text-xl font-bold font-mono text-white">{ipCount}</span>
          </div>
        </div>

        <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-lg flex items-center gap-3.5">
          <div className="p-2.5 bg-purple-950/40 border border-purple-800/60 rounded-lg text-purple-400 shrink-0">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-zinc-400 block">{isAr ? 'بصمات أجهزة محظورة' : 'Blocked Devices'}</span>
            <span className="text-xl font-bold font-mono text-white">{deviceCount}</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute top-1/2 -translate-y-1/2 start-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isAr ? 'بحث برقم الهاتف، الـ IP، الإيميل، رقم الطلب...' : 'Search by phone, IP, email, or order ID...'}
          className="w-full bg-zinc-900/80 border border-zinc-800 text-white text-xs ps-9 pe-4 py-2.5 rounded-lg focus:outline-none focus:border-red-500 font-mono placeholder:text-zinc-500"
        />
      </div>

      {/* Table Container */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <span className="text-xs">{isAr ? 'جاري تحميل قائمة الحظر...' : 'Loading blacklist...'}</span>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 flex flex-col items-center justify-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400/60" />
            <p className="text-sm font-bold text-zinc-300">
              {searchQuery ? (isAr ? 'لا توجد نتائج تطابق بحثك' : 'No matching results') : (isAr ? 'قائمة الحظر نظيفة تماماً ولا يوجد أي محظورين' : 'Blacklist is empty')}
            </p>
            <p className="text-xs text-zinc-500 max-w-md">
              {isAr ? 'عند حظر أي رقم أو سبامر من تفاصيل الطلب سيظهر هنا فوراً مع إمكانية فك حظره بأي وقت.' : 'Blocked spam orders will appear here automatically with 1-click unblock capability.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4 text-start">{isAr ? 'الهوية المحظورة' : 'Identity'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'عنوان IP والشبكة' : 'IP Address'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'بصمة الجهاز' : 'Device ID'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'سبب الحظر والطلب' : 'Reason & Order'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'التاريخ' : 'Date'}</th>
                  <th className="py-3 px-4 text-center">{isAr ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-zinc-800/30 transition-colors">
                    {/* Identity (Phone / Email / Name) */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {entry.customerName && (
                          <div className="font-bold text-white text-xs">{entry.customerName}</div>
                        )}
                        {entry.phone ? (
                          <div className="flex items-center gap-1.5 font-mono text-amber-400 font-bold">
                            <Smartphone className="w-3.5 h-3.5 shrink-0" />
                            <span>{entry.phone}</span>
                          </div>
                        ) : null}
                        {entry.email ? (
                          <div className="text-zinc-400 font-mono text-[11px] truncate max-w-[180px]">
                            {entry.email}
                          </div>
                        ) : null}
                        {!entry.phone && !entry.email && (
                          <span className="text-zinc-500 font-mono text-[11px]">
                            {isAr ? 'حظر على مستوى الـ IP/الجهاز' : 'IP/Device Ban'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* IP */}
                    <td className="py-3.5 px-4 font-mono">
                      {entry.ip ? (
                        <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px]">
                          {entry.ip}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Device Fingerprint */}
                    <td className="py-3.5 px-4 font-mono">
                      {entry.deviceFingerprint ? (
                        <span 
                          className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300 text-[10px] block truncate max-w-[160px]"
                          title={entry.deviceFingerprint}
                        >
                          {entry.deviceFingerprint}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>

                    {/* Reason & Order */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="text-zinc-300 font-medium line-clamp-1">
                          {entry.reason || (isAr ? 'طلب وهمي / سبام' : 'Spam Order')}
                        </div>
                        {entry.orderId && (
                          <span className="text-[10px] font-mono text-zinc-500 block">
                            #{entry.orderId}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-zinc-400 text-[11px]">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : '—'}
                    </td>

                    {/* Action: Unblock Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleUnblock(entry)}
                        disabled={unblockingId === entry.id}
                        className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 font-bold rounded text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        title={isAr ? 'فك الحظر عن هذا العميل/الجهاز' : 'Unblock this entry'}
                      >
                        {unblockingId === entry.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span>{isAr ? 'فك الحظر' : 'Unblock'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Manual Ban Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-md overflow-hidden shadow-2xl p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-base text-white">{isAr ? 'إضافة حظر يدوي' : 'Add Manual Ban'}</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualBan} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  {isAr ? 'رقم الموبايل المصري' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white p-2.5 rounded font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  {isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="spammer@example.com"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white p-2.5 rounded font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  {isAr ? 'عنوان الـ IP (اختياري)' : 'IP Address (Optional)'}
                </label>
                <input
                  type="text"
                  value={manualIp}
                  onChange={(e) => setManualIp(e.target.value)}
                  placeholder="192.168.1.1"
                  className="w-full bg-zinc-900 border border-zinc-700 text-white p-2.5 rounded font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  {isAr ? 'سبب الحظر' : 'Reason'}
                </label>
                <input
                  type="text"
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  placeholder={isAr ? 'طلب وهمي / محاولة استنزاف مخزون' : 'Fake orders / inventory spam'}
                  className="w-full bg-zinc-900 border border-zinc-700 text-white p-2.5 rounded focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-bold transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isAr ? 'حظر وتأكيد' : 'Confirm Ban'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
