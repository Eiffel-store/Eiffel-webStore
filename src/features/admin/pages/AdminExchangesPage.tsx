import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Eye,
  Phone,
  MapPin,
  MessageSquare,
  Loader2,
  ChevronDown,
  X,
  ShieldCheck,
  Check
} from 'lucide-react';
import { exchangeService } from '@/services/exchangeService';
import { ExchangeRequest, ExchangeStatus } from '@/types';
import { useLanguage } from '@/shared';
import toast from 'react-hot-toast';

export const AdminExchangesPage: React.FC = () => {
  const { isRTL, t } = useLanguage();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<ExchangeRequest | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ExchangeStatus | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState<string>('');
  const [actionModalOpen, setActionModalOpen] = useState<boolean>(false);

  // Fetch all exchange requests
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-exchanges'],
    queryFn: () => exchangeService.getAll(),
  });

  // Mutation to update request status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }) =>
      exchangeService.updateStatus(id, status, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exchanges'] });
      toast.success(isRTL ? 'تم تحديث حالة طلب الاستبدال بنجاح' : 'Status updated successfully');
      setActionModalOpen(false);
      setSelectedRequest(null);
      setSelectedStatus(null);
      setAdminNoteInput('');
    },
    onError: () => {
      toast.error(isRTL ? 'حدث خطأ أثناء تحديث الحالة' : 'Failed to update status');
    }
  });

  const handleOpenActionModal = (req: ExchangeRequest) => {
    setSelectedRequest(req);
    setSelectedStatus(req.status);
    setAdminNoteInput(req.adminNotes || '');
    setActionModalOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (!selectedRequest || !selectedStatus) return;
    updateStatusMutation.mutate({
      id: selectedRequest.id,
      status: selectedStatus,
      adminNotes: adminNoteInput.trim() || undefined,
    });
  };

  // Filter & search
  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      req.orderId?.toLowerCase().includes(term) ||
      req.customerName?.toLowerCase().includes(term) ||
      req.customerEmail?.toLowerCase().includes(term) ||
      req.customerPhone?.toLowerCase().includes(term) ||
      req.productName?.toLowerCase().includes(term);

    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'PENDING').length,
    approved: requests.filter((r) => r.status === 'APPROVED').length,
    inTransit: requests.filter((r) => r.status === 'IN_TRANSIT').length,
    completed: requests.filter((r) => r.status === 'COMPLETED').length,
    rejected: requests.filter((r) => r.status === 'REJECTED').length,
  };

  const getStatusBadge = (status: ExchangeStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>{isRTL ? 'قيد المراجعة' : 'Pending'}</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isRTL ? 'تمت الموافقة' : 'Approved'}</span>
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Truck className="w-3 h-3" />
            <span>{isRTL ? 'جاري الاستبدال' : 'In Transit'}</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isRTL ? 'مكتمل' : 'Completed'}</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            <span>{isRTL ? 'مرفوض' : 'Rejected'}</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'EXCHANGE_SIZE':
        return <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[10px] font-mono">{isRTL ? 'استبدال مقاس' : 'Size Exchange'}</span>;
      case 'EXCHANGE_COLOR':
        return <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[10px] font-mono">{isRTL ? 'استبدال لون' : 'Color Exchange'}</span>;
      case 'DEFECT':
        return <span className="px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40 text-[10px] font-mono">{isRTL ? 'عيب صناعة' : 'Defect'}</span>;
      case 'RETURN_REFUND':
        return <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 text-[10px] font-mono">{isRTL ? 'إرجاع واسترداد' : 'Return & Refund'}</span>;
      default:
        return <span className="text-[10px] font-mono">{type}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-editorial font-bold uppercase tracking-wider text-white">
              {isRTL ? 'إدارة طلبات الاستبدال والاسترجاع' : 'Exchanges & Returns Manager'}
            </h1>
          </div>
          <p className="text-xs font-mono text-zinc-400">
            {isRTL ? 'متابعة وفحص طلبات استبدال المقاسات والألوان وإرجاع الطلبات' : 'Manage customer size/color exchanges and return requests'}
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="self-start sm:self-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{isRTL ? 'تحديث البيانات' : 'Refresh'}</span>
        </button>
      </div>

      {/* Stats / Status Filter Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: 'ALL', labelAr: 'كل الطلبات', labelEn: 'All Requests', count: counts.all, color: 'text-white' },
          { key: 'PENDING', labelAr: 'قيد المراجعة', labelEn: 'Pending Review', count: counts.pending, color: 'text-amber-400' },
          { key: 'APPROVED', labelAr: 'تمت الموافقة', labelEn: 'Approved', count: counts.approved, color: 'text-blue-400' },
          { key: 'IN_TRANSIT', labelAr: 'جاري الاستبدال', labelEn: 'In Transit', count: counts.inTransit, color: 'text-purple-400' },
          { key: 'COMPLETED', labelAr: 'مكتمل', labelEn: 'Completed', count: counts.completed, color: 'text-emerald-400' },
          { key: 'REJECTED', labelAr: 'مرفوض', labelEn: 'Rejected', count: counts.rejected, color: 'text-red-400' },
        ].map((tab) => {
          const isActive = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                  : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">{isRTL ? tab.labelAr : tab.labelEn}</span>
                <span className={`text-base font-mono font-bold ${tab.color}`}>{tab.count}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 rounded-xl p-3">
        <Search className="w-4 h-4 text-zinc-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={isRTL ? 'بحث برقم الطلب، اسم العميل، رقم الهاتف، أو اسم المنتج...' : 'Search by order #, customer, phone, product...'}
          className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none"
        />
      </div>

      {/* Table / List */}
      {isLoading ? (
        <div className="py-20 text-center text-zinc-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-400" />
          <p className="text-xs font-mono">{t.loading}</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {isRTL ? 'لا توجد طلبات استبدال مطابقة' : 'No Exchange Requests Found'}
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {isRTL
                ? 'لم يتم العثور على أي طلبات استبدال تطابق معايير البحث أو الفلاتر الحالية.'
                : 'No exchange requests match your current search or filter criteria.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 sm:p-6 space-y-4 transition-all shadow-md"
            >
              {/* Top Row: Order #, Customer & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-mono text-sm font-bold text-white bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                    #{req.orderId}
                  </span>
                  {getTypeBadge(req.requestType)}
                  {getStatusBadge(req.status)}
                  <span className="text-[11px] font-mono text-zinc-500">
                    {new Date(req.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Action Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenActionModal(req)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-zinc-500 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{isRTL ? 'تحديث ومراجعة الطلب' : 'Update Status'}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Middle Row: Product Exchange Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Product Preview (Cols 1-5) */}
                <div className="md:col-span-5 flex gap-3 p-3 bg-zinc-900/60 border border-zinc-850 rounded-xl">
                  {req.productImage && (
                    <img src={req.productImage} alt="Product" className="w-14 h-18 object-cover rounded-lg shrink-0 border border-zinc-800" />
                  )}
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-editorial font-bold text-white truncate">{req.productName}</h4>
                    <div className="text-[11px] font-mono text-zinc-400 space-y-0.5">
                      <div>
                        <span>{isRTL ? 'القطعة الحالية:' : 'Current:'} </span>
                        <strong className="text-zinc-200">{req.originalSize}</strong> {req.originalColor && `• ${req.originalColor}`}
                      </div>
                      <div className="text-amber-400 font-bold">
                        <span>{isRTL ? 'المطلوب بدلاً منها:' : 'Requested:'} </span>
                        <span>{req.requestedSize || req.requestedColor || (isRTL ? 'استرجاع المبلغ' : 'Refund')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Contact & Pickup Location (Cols 6-8) */}
                <div className="md:col-span-4 space-y-1.5 text-xs font-mono bg-zinc-900/40 p-3 rounded-xl border border-zinc-850">
                  <div className="font-bold text-white">{req.customerName}</div>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                    <Phone className="w-3 h-3 text-amber-500" />
                    <span>{req.customerPhone || req.customerEmail}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-zinc-400 text-[11px]">
                    <MapPin className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{req.pickupCity} - {req.pickupAddress}</span>
                  </div>
                </div>

                {/* Reason & Notes (Cols 9-12) */}
                <div className="md:col-span-3 space-y-2 text-xs">
                  <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-850 space-y-1">
                    <div className="text-[11px] font-mono text-zinc-500 font-bold">{isRTL ? 'السبب:' : 'Reason:'}</div>
                    <div className="text-zinc-300 text-xs">{req.reason}</div>
                    {req.customerNotes && (
                      <div className="text-[11px] text-zinc-400 italic pt-1 border-t border-zinc-800 mt-1">
                        "{req.customerNotes}"
                      </div>
                    )}
                  </div>

                  {/* Proof Photo thumbnail */}
                  {req.proofImageUrl && (
                    <a
                      href={req.proofImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] font-mono text-amber-400 hover:underline"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{isRTL ? 'معاينة صورة القطعة المرفقة ↗' : 'View Uploaded Photo ↗'}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Admin Note display if exists */}
              {req.adminNotes && (
                <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded-lg text-xs font-mono text-amber-200 flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>{isRTL ? 'ملاحظة الإدارة:' : 'Admin Note:'}</strong> {req.adminNotes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Structured Update Status Modal with Confirm and Cancel Buttons */}
      {actionModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
              <div>
                <h3 className="text-base font-editorial font-bold text-white uppercase tracking-wider">
                  {isRTL ? 'تحديث حالة طلب الاستبدال' : 'Update Exchange Status'}
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">
                  Order #{selectedRequest.orderId} • {selectedRequest.customerName}
                </p>
              </div>
              <button
                onClick={() => setActionModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Select Status Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  {isRTL ? '1. اختر الحالة الجديدة للطلب:' : '1. Select New Status:'}
                </label>
                <div className="grid grid-cols-2 gap-2.5 font-mono">
                  {/* Approve */}
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('APPROVED')}
                    className={`p-3 rounded-xl border text-center font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedStatus === 'APPROVED'
                        ? 'border-blue-500 bg-blue-500/25 text-white ring-2 ring-blue-500/50 shadow-lg'
                        : 'border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>{isRTL ? 'الموافقة على الطلب' : 'Approve'}</span>
                    {selectedStatus === 'APPROVED' && <Check className="w-3.5 h-3.5 ml-auto text-blue-300" />}
                  </button>

                  {/* In Transit */}
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('IN_TRANSIT')}
                    className={`p-3 rounded-xl border text-center font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedStatus === 'IN_TRANSIT'
                        ? 'border-purple-500 bg-purple-500/25 text-white ring-2 ring-purple-500/50 shadow-lg'
                        : 'border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-purple-400" />
                    <span>{isRTL ? 'جاري الاستبدال' : 'In Transit'}</span>
                    {selectedStatus === 'IN_TRANSIT' && <Check className="w-3.5 h-3.5 ml-auto text-purple-300" />}
                  </button>

                  {/* Complete */}
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('COMPLETED')}
                    className={`p-3 rounded-xl border text-center font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedStatus === 'COMPLETED'
                        ? 'border-emerald-500 bg-emerald-500/25 text-white ring-2 ring-emerald-500/50 shadow-lg'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{isRTL ? 'تم الاستبدال بنجاح' : 'Complete'}</span>
                    {selectedStatus === 'COMPLETED' && <Check className="w-3.5 h-3.5 ml-auto text-emerald-300" />}
                  </button>

                  {/* Reject */}
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('REJECTED')}
                    className={`p-3 rounded-xl border text-center font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      selectedStatus === 'REJECTED'
                        ? 'border-red-500 bg-red-500/25 text-white ring-2 ring-red-500/50 shadow-lg'
                        : 'border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>{isRTL ? 'رفض الطلب' : 'Reject'}</span>
                    {selectedStatus === 'REJECTED' && <Check className="w-3.5 h-3.5 ml-auto text-red-300" />}
                  </button>
                </div>
              </div>

              {/* Admin Note Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  {isRTL ? '2. ملاحظات وتوجيهات الإدارة (تظهر للعميل في حسابه):' : '2. Admin Notes (Visible to Customer):'}
                </label>
                <textarea
                  rows={3}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder={
                    selectedStatus === 'REJECTED'
                      ? (isRTL ? 'يرجى كتابة سبب الرفض هنا ليظهر للعميل...' : 'Please write the reason for rejection...')
                      : (isRTL ? 'اكتب أي ملاحظة أو موعد توجه المندوب للعميل...' : 'Write notes for the customer or courier instructions...')
                  }
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-400 rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Footer with explicit Confirm and Cancel buttons */}
            <div className="px-6 py-4 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActionModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {isRTL ? 'إلغاء وإغلاق' : 'Close'}
              </button>

              <button
                type="button"
                disabled={!selectedStatus || updateStatusMutation.isPending}
                onClick={handleConfirmUpdate}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateStatusMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{isRTL ? 'تأكيد وحفظ الحالة' : 'Confirm Update'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
