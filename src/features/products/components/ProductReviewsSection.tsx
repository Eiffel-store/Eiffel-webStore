import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  Filter,
  Sparkles,
  Award,
  Calendar,
  User,
  X,
  Lock,
  LogIn
} from 'lucide-react';
import { Product, Review, ProductReviewsSummary, CreateReviewInput } from '@/types';
import { useLanguage, Pagination, Skeleton } from '@/shared';
import { reviewService } from '@/services/reviewService';
import { useAuthStore } from '@/stores/useAuthStore';
import toast from 'react-hot-toast';

interface ProductReviewsSectionProps {
  product: Product;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({ product }) => {
  const { isRTL, t } = useLanguage();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | undefined>(undefined);

  // Review Submission Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number>(0);
  const [formName, setFormName] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formComment, setFormComment] = useState<string>('');

  const { data: summary, isLoading } = useQuery<ProductReviewsSummary | null>({
    queryKey: ['product-reviews', product?.id, currentPage, pageSize, selectedRatingFilter],
    queryFn: async () => {
      if (!product?.id) return null;
      try {
        const data = await reviewService.getProductReviews(
          product.id,
          currentPage,
          pageSize,
          selectedRatingFilter
        );
        if (data) return data;
      } catch (err) {
        console.error('Error loading reviews:', err);
      }

      return {
        averageRating: product.rating || 5.0,
        totalReviews: 0,
        recommendationRate: 100,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        reviews: {
          content: [],
          pageNumber: 1,
          pageSize: 5,
          totalElements: 0,
          totalPages: 1,
          isFirst: true,
          isLast: true
        }
      };
    },
    staleTime: 1000 * 30, // 30s fresh
    gcTime: 1000 * 60 * 10,
    enabled: Boolean(product?.id)
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error(t.loginToReviewTitle);
      return;
    }

    if (!formComment.trim()) {
      toast.error(isRTL ? 'يرجى كتابة تفاصيل تجربتك ورأيك' : 'Please provide your review details');
      return;
    }

    const customerName = user?.name?.trim() || user?.email?.split('@')[0] || formName.trim() || 'عميل إيفل';
    const customerEmail = user?.email?.trim() || formEmail.trim() || undefined;

    setIsSubmitting(true);
    try {
      const input: CreateReviewInput = {
        rating: formRating,
        customerName: customerName,
        customerEmail: customerEmail,
        title: formTitle.trim() || undefined,
        comment: formComment.trim()
      };

      await reviewService.addReview(product.id, input);
      toast.success(
        isRTL
          ? 'تمت إضافة تقييمك بنجاح! شكراً لمشاركتنا تجربتك الفاخرة.'
          : 'Thank you! Your review has been submitted successfully.'
      );
      setIsModalOpen(false);
      setFormName('');
      setFormEmail('');
      setFormTitle('');
      setFormComment('');
      setFormRating(5);
      setCurrentPage(1);
      
      // Invalidate review queries & product caches so new rating is immediately reflected
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['product-reviews', product.id] }),
        queryClient.invalidateQueries({ queryKey: ['product', product.id] }),
        queryClient.invalidateQueries({ queryKey: ['products'] })
      ]);
    } catch (err) {
      toast.error(isRTL ? 'فشل إرسال التقييم، يرجى المحاولة لاحقاً' : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = summary?.averageRating || product.rating || 5.0;
  const totalReviews = summary?.totalReviews || 0;
  const recommendationRate = summary?.recommendationRate || 98;
  const distribution = summary?.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const reviewsList = summary?.reviews?.content || [];
  const totalPages = summary?.reviews?.totalPages || 1;
  const totalElements = summary?.reviews?.totalElements || 0;

  return (
    <section id="product-reviews-section" className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-surface-container dark:border-zinc-800 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-label-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.clientReviews}</span>
            </span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-4xl text-primary dark:text-white mt-1">
            {t.ratingsAndReviews}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-label-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-amber-400/20 flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>{t.writeReview}</span>
        </button>
      </div>

      {/* Aggregate Rating Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 rounded-2xl shadow-sm mb-10">
        {/* Left Score (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center pb-6 md:pb-0 border-b md:border-b-0 md:border-r rtl:md:border-r-0 rtl:md:border-l border-surface-container dark:border-zinc-800">
          <div className="text-4xl sm:text-5xl font-mono font-bold text-primary dark:text-white">
            {avgRating.toFixed(1)}
          </div>

          <div className="flex items-center gap-1 my-2.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  star <= Math.round(avgRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-zinc-700 text-zinc-700'
                }`}
              />
            ))}
          </div>

          <p className="text-xs font-mono text-secondary dark:text-zinc-400">
            {isRTL ? `مبني على ${totalReviews} تقييم موثق` : `Based on ${totalReviews} verified reviews`}
          </p>

          <div className="mt-3 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-full text-[11px] font-mono font-bold flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span>{`${recommendationRate}% ${t.recommendationRate}`}</span>
          </div>
        </div>

        {/* Right Star Distribution (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
            <span>{t.ratingBreakdown}</span>
            {selectedRatingFilter && (
              <button
                type="button"
                onClick={() => {
                  setSelectedRatingFilter(undefined);
                  setCurrentPage(1);
                }}
                className="text-amber-400 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <span>{t.clearFilter}</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            const isSelected = selectedRatingFilter === stars;

            return (
              <button
                key={stars}
                type="button"
                onClick={() => {
                  setSelectedRatingFilter(isSelected ? undefined : stars);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-3 w-full text-xs font-mono p-1 rounded transition-colors text-left rtl:text-right cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400/10 border border-amber-400/30'
                    : 'hover:bg-zinc-900/50'
                }`}
              >
                <span className="w-8 flex items-center gap-1 font-bold text-zinc-300">
                  <span>{stars}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>

                <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <span className="w-10 text-right rtl:text-left text-zinc-500 text-[11px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reviews List & Pagination */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" className="w-10 h-10" />
                  <div className="space-y-1">
                    <Skeleton className="w-32 h-4 rounded" />
                    <Skeleton className="w-20 h-3 rounded" />
                  </div>
                </div>
                <Skeleton className="w-20 h-4 rounded" />
              </div>
              <Skeleton className="w-full h-10 rounded" />
            </div>
          ))}
        </div>
      ) : reviewsList.length === 0 ? (
        <div className="text-center py-12 px-4 bg-zinc-950 border border-zinc-800 rounded-xl">
          <Award className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-60" />
          <h4 className="text-base font-bold text-white mb-1">
            {t.noReviewsFound}
          </h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
            {t.noReviewsFoundDesc}
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-400/30 text-xs font-mono cursor-pointer"
          >
            {t.writeFirstReview}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-4">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-5 sm:p-6 bg-surface-container-lowest dark:bg-zinc-950 border border-surface-container dark:border-zinc-800 rounded-xl space-y-3 transition-colors hover:border-zinc-700"
              >
                {/* Top Row: User & Stars */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 text-amber-400 font-bold flex items-center justify-center text-xs border border-zinc-700">
                      {rev.customerName ? rev.customerName.slice(0, 1).toUpperCase() : 'C'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-bold text-sm text-primary dark:text-white">
                          {rev.customerName}
                        </span>
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t.verifiedBuyer}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stars & Date */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-zinc-800 text-zinc-800'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(rev.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>
                    </span>
                  </div>
                </div>

                {/* Review Title */}
                {rev.title && (
                  <h4 className="font-sans font-bold text-sm text-primary dark:text-zinc-100">
                    {rev.title}
                  </h4>
                )}

                {/* Review Comment */}
                <p className="text-xs sm:text-sm text-secondary dark:text-zinc-300 leading-relaxed font-light">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalElements > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalElements}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setCurrentPage(1);
              }}
              pageSizeOptions={[5, 10, 20]}
            />
          )}
        </div>
      )}

      {/* Write a Review Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl text-zinc-100 p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase">
                    {t.writeReview}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans truncate max-w-[280px]">
                    {product.name}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isAuthenticated ? (
              <div className="py-6 px-2 text-center space-y-5 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-bold text-white">
                    {t.loginToReviewTitle}
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                    {t.loginToReviewDesc}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      navigate('/account');
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-label-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t.signInNow}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono rounded-lg border border-zinc-700 cursor-pointer transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Logged in User Profile Info Card */}
                <div className="flex items-center gap-3 p-3.5 bg-zinc-900/90 border border-amber-500/20 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black font-bold flex items-center justify-center text-sm shrink-0 shadow-md">
                    {user?.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-white truncate">
                        {user?.name || user?.email?.split('@')[0]}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{t.verifiedBuyer}</span>
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Interactive Star Rating Selector */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-2">
                    {t.overallRating}
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (formHoverRating || formRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          onMouseEnter={() => setFormHoverRating(star)}
                          onMouseLeave={() => setFormHoverRating(0)}
                          className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              isFilled
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-zinc-800 text-zinc-700'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-mono font-bold text-amber-400 ml-2 rtl:mr-2">
                      {formRating} / 5 {t.reviews}
                    </span>
                  </div>
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    {t.reviewTitle}:
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={isRTL ? 'مثال: خامة فائقة وتطريز متقن' : 'e.g. Exquisite fabric & fit'}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    {t.reviewComment} *:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    placeholder={
                      isRTL
                        ? 'شاركنا رأيك في جودة القماش، المقاس، تفاصيل الخياطة وسرعة التوصيل...'
                        : 'Share your thoughts on the craftsmanship, fit, fabric quality and delivery...'
                    }
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {t.cancel}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs shadow-lg shadow-amber-400/20 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? t.submittingReview : t.submitReview}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
