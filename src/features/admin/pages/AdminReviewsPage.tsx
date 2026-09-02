import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Star,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { reviewService } from '@/services/reviewService';
import { useLanguage, useStoreData, Pagination, Skeleton } from '@/shared';
import { Review, PageResponse } from '@/types';
import toast from 'react-hot-toast';

export const AdminReviewsPage: React.FC = () => {
  const { isRTL, t } = useLanguage();
  const { getProductById } = useStoreData();
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  // Fetch reviews stats
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['admin-reviews-stats'],
    queryFn: () => reviewService.getReviewsStats(),
    staleTime: 1000 * 30,
  });

  // Fetch paginated admin reviews
  const {
    data: pagedData,
    isLoading: isReviewsLoading,
    refetch,
    isFetching
  } = useQuery<PageResponse<Review> | null>({
    queryKey: ['admin-reviews', page, pageSize],
    queryFn: () => reviewService.getAdminReviews(page, pageSize),
    staleTime: 1000 * 30,
  });

  // Mutation: Delete review
  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => {
      toast.success(t.adminReviewDeletedSuccess);
      setReviewToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-stats'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      toast.error(isRTL ? 'فشل حذف التقييم' : 'Failed to delete review');
    }
  });

  // Mutation: Update status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      reviewService.updateReviewStatus(id, status),
    onSuccess: () => {
      toast.success(t.adminReviewStatusUpdated);
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reviews-stats'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      toast.error(isRTL ? 'فشل تحديث حالة التقييم' : 'Failed to update review status');
    }
  });

  const allReviews: Review[] = pagedData?.content || [];

  // Client-side filtering for search, rating, and status
  const filteredReviews: Review[] = allReviews.filter((rev: Review) => {
    const matchesSearch =
      !searchTerm.trim() ||
      rev.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.comment?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === 'ALL' || rev.rating === ratingFilter;
    const matchesStatus =
      statusFilter === 'ALL' || (rev.status || 'APPROVED') === statusFilter;

    return matchesSearch && matchesRating && matchesStatus;
  });

  const totalReviewsCount = stats?.totalReviews ?? pagedData?.totalElements ?? 0;
  const avgRating = stats?.averageRating ?? 5.0;
  const approvedCount = stats?.approvedCount ?? totalReviewsCount;
  const pendingCount = stats?.pendingCount ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <span>{t.adminHeaderReviews}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {isRTL
              ? 'مراقبة تقييمات العملاء والتحكم في المراجعات المعروضة على المتجر'
              : 'Moderate customer ratings, verify genuine feedback and maintain store reputation'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium rounded flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-amber-400' : ''}`} />
          <span>{isRTL ? 'تحديث' : 'Refresh'}</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reviews */}
        <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>{t.adminTotalReviewsStat}</span>
            <MessageSquare className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
            {isStatsLoading ? '...' : totalReviewsCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {isRTL ? 'إجمالي المراجعات المسجلة' : 'Recorded product reviews'}
          </div>
        </div>

        {/* Average Rating */}
        <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>{t.adminAverageRatingStat}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 flex items-center gap-1.5">
            <span>{isStatsLoading ? '...' : avgRating.toFixed(1)}</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${
                    s <= Math.round(avgRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-zinc-700 text-zinc-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {isRTL ? 'المتوسط العام لكافة المنتجات' : 'Storewide average score'}
          </div>
        </div>

        {/* Approved Reviews */}
        <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>{t.adminApprovedReviews}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
            {isStatsLoading ? '...' : approvedCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {isRTL ? 'منشورة وظاهرة للعملاء' : 'Active and published'}
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>{t.adminPendingReviews}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
            {isStatsLoading ? '...' : pendingCount}
          </div>
          <div className="text-[10px] text-zinc-500 font-mono">
            {isRTL ? 'تحت التدقيق والمراجعة' : 'Awaiting moderation'}
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isRTL
                ? 'البحث باسم العميل، الإيميل، أو نص التقييم...'
                : 'Search by client name, email, or comment...'
            }
            className="w-full bg-zinc-950 border border-zinc-700 pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 rounded focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Rating Filter */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={ratingFilter}
              onChange={(e) =>
                setRatingFilter(
                  e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)
                )
              }
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-900">
                {isRTL ? 'كل النجوم' : 'All Stars'}
              </option>
              <option value="5" className="bg-zinc-900">5 ★★★★★</option>
              <option value="4" className="bg-zinc-900">4 ★★★★☆</option>
              <option value="3" className="bg-zinc-900">3 ★★★☆☆</option>
              <option value="2" className="bg-zinc-900">2 ★★☆☆☆</option>
              <option value="1" className="bg-zinc-900">1 ★☆☆☆☆</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-900">
                {isRTL ? 'كل الحالات' : 'All Status'}
              </option>
              <option value="APPROVED" className="bg-zinc-900">
                {isRTL ? 'معتمدة (APPROVED)' : 'Approved'}
              </option>
              <option value="PENDING" className="bg-zinc-900">
                {isRTL ? 'معلقة (PENDING)' : 'Pending'}
              </option>
              <option value="REJECTED" className="bg-zinc-900">
                {isRTL ? 'مرفوضة (REJECTED)' : 'Rejected'}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table / Grid */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {isReviewsLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full bg-zinc-900 rounded-lg" />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {isRTL ? 'لا توجد تقييمات مطابقة' : 'No Reviews Found'}
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {isRTL
                ? 'لم يتم العثور على أي مراجعات تطابق معايير البحث أو الفلاتر الحالية.'
                : 'No customer reviews match your current search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-850">
            {filteredReviews.map((rev: Review) => {
              const currentStatus = rev.status || 'APPROVED';
              const product = rev.productId ? getProductById(rev.productId) : null;
              const formattedDate = new Date(rev.createdAt).toLocaleDateString(
                isRTL ? 'ar-EG' : 'en-US',
                { year: 'numeric', month: 'short', day: 'numeric' }
              );

              return (
                <div
                  key={rev.id}
                  className="p-5 sm:p-6 hover:bg-zinc-900/30 transition-colors flex flex-col gap-3.5"
                >
                  {/* 1. Header Bar: User profile on one side, Status + Actions on other */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-850/80">
                    {/* User info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-zinc-800 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center text-sm shrink-0 shadow-sm">
                        {rev.customerName ? rev.customerName.slice(0, 1).toUpperCase() : 'U'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-white">
                            {rev.customerName}
                          </span>
                          {rev.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>{t.verifiedBuyer}</span>
                            </span>
                          )}
                        </div>
                        {rev.customerEmail && (
                          <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                            {rev.customerEmail}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meta Controls (Stars + Date + Status + Delete) */}
                    <div className="flex items-center gap-3 self-start sm:self-center flex-wrap">
                      {/* Star Rating Badge */}
                      <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-zinc-800 text-zinc-800'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono font-bold text-amber-400">
                          {rev.rating}.0
                        </span>
                      </div>

                      {/* Date */}
                      <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1 whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                        <span>{formattedDate}</span>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={currentStatus}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: rev.id,
                            status: e.target.value
                          })
                        }
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none transition-all shadow-xs ${
                          currentStatus === 'APPROVED'
                            ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300'
                            : currentStatus === 'PENDING'
                            ? 'bg-amber-950/80 border-amber-700/80 text-amber-300'
                            : 'bg-red-950/80 border-red-700/80 text-red-300'
                        }`}
                      >
                        <option value="APPROVED" className="bg-zinc-900 text-emerald-400">
                          {t.adminApprovedReviews}
                        </option>
                        <option value="PENDING" className="bg-zinc-900 text-amber-400">
                          {t.adminPendingReviews}
                        </option>
                        <option value="REJECTED" className="bg-zinc-900 text-red-400">
                          {t.adminRejectedReviews}
                        </option>
                      </select>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setReviewToDelete(rev)}
                        className="p-1.5 bg-zinc-900 hover:bg-red-950/60 text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-800 rounded-lg transition-colors cursor-pointer"
                        title={isRTL ? 'حذف التقييم نهائياً' : 'Delete review'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 2. Review Content */}
                  <div className="space-y-1.5 pr-2 rtl:pr-2 ltr:pl-2 border-r-2 rtl:border-r-2 ltr:border-l-2 border-amber-500/30">
                    {rev.title && (
                      <h4 className="text-sm font-bold text-amber-300 tracking-tight">
                        {rev.title}
                      </h4>
                    )}
                    <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                      {rev.comment}
                    </p>
                  </div>

                  {/* 3. Attached Product Mini-Banner */}
                  {rev.productId && (
                    <div className="pt-1">
                      <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 max-w-full">
                        {product?.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-7 h-9 object-cover rounded bg-zinc-950 border border-zinc-800 shrink-0"
                          />
                        ) : null}
                        <div className="min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-zinc-300 truncate block">
                            {product?.name || (isRTL ? 'منتج رقم:' : 'Product:') + ' ' + rev.productId}
                          </span>
                        </div>
                        <Link
                          to={`/product/${rev.productId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-mono text-amber-400 hover:underline flex items-center gap-1 shrink-0 ml-2 rtl:ml-0 rtl:mr-2"
                        >
                          <span>{isRTL ? 'معاينة' : 'View'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagedData && pagedData.totalPages > 1 && (
          <div className="p-4 border-t border-zinc-850">
            <Pagination
              currentPage={page}
              totalPages={pagedData.totalPages}
              totalItems={pagedData.totalElements}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPage(1);
              }}
              pageSizeOptions={[10, 20, 50]}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  {isRTL ? 'تأكيد حذف التقييم' : 'Confirm Delete Review'}
                </h3>
                <p className="text-xs text-zinc-400">
                  {t.adminDeleteReviewConfirm}
                </p>
              </div>
            </div>

            {/* Review Preview */}
            <div className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800 text-xs space-y-1">
              <div className="font-bold text-white">
                {reviewToDelete.customerName} ({reviewToDelete.rating} ★)
              </div>
              <p className="text-zinc-400 line-clamp-2">
                {reviewToDelete.comment}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium rounded cursor-pointer transition-colors"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(reviewToDelete.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleteMutation.isPending ? '...' : (isRTL ? 'حذف نهائياً' : 'Delete Permanently')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
