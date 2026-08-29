import { apiClient } from './apiClient';
import { ApiResponse, ProductReviewsSummary, Review, CreateReviewInput, PageResponse } from '@/types';

export const reviewService = {
  // Get paginated reviews for a product with summary & rating filters
  getProductReviews: async (
    productId: string,
    page: number = 1,
    size: number = 5,
    rating?: number
  ): Promise<ProductReviewsSummary | null> => {
    try {
      const pageIndex = Math.max(0, page - 1);
      const query = new URLSearchParams();
      query.append('page', String(pageIndex));
      query.append('size', String(size));
      if (rating && rating >= 1 && rating <= 5) {
        query.append('rating', String(rating));
      }

      const response = await apiClient.get<ApiResponse<ProductReviewsSummary>>(
        `/products/${productId}/reviews?${query.toString()}`
      );
      return response.data?.data || null;
    } catch (err) {
      console.warn('Failed to fetch product reviews from backend, using fallback:', err);
      return null;
    }
  },

  // Submit a customer review
  addReview: async (productId: string, input: CreateReviewInput): Promise<Review | null> => {
    try {
      const response = await apiClient.post<ApiResponse<Review>>(
        `/products/${productId}/reviews`,
        input
      );
      return response.data?.data || null;
    } catch (err) {
      console.error('Failed to submit product review:', err);
      throw err;
    }
  },

  // Get admin paginated reviews
  getAdminReviews: async (page: number = 1, size: number = 10): Promise<PageResponse<Review> | null> => {
    try {
      const pageIndex = Math.max(0, page - 1);
      const response = await apiClient.get<ApiResponse<PageResponse<Review>>>(
        `/admin/reviews?page=${pageIndex}&size=${size}`
      );
      return response.data?.data || null;
    } catch (err) {
      console.error('Failed to fetch admin reviews:', err);
      return null;
    }
  },

  // Get admin reviews statistics
  getReviewsStats: async (): Promise<{
    totalReviews: number;
    approvedCount: number;
    pendingCount: number;
    rejectedCount: number;
    averageRating: number;
  } | null> => {
    try {
      const response = await apiClient.get<ApiResponse<{
        totalReviews: number;
        approvedCount: number;
        pendingCount: number;
        rejectedCount: number;
        averageRating: number;
      }>>('/admin/reviews/stats');
      return response.data?.data || null;
    } catch (err) {
      console.error('Failed to fetch reviews stats:', err);
      return null;
    }
  },

  // Update review status (APPROVED / PENDING / REJECTED)
  updateReviewStatus: async (id: string, status: string): Promise<Review | null> => {
    try {
      const response = await apiClient.patch<ApiResponse<Review>>(
        `/admin/reviews/${id}/status?status=${status}`
      );
      return response.data?.data || null;
    } catch (err) {
      console.error('Failed to update review status:', err);
      throw err;
    }
  },

  // Permanently delete a review
  deleteReview: async (id: string): Promise<boolean> => {
    try {
      await apiClient.delete<ApiResponse<void>>(`/admin/reviews/${id}`);
      return true;
    } catch (err) {
      console.error('Failed to delete review:', err);
      throw err;
    }
  }
};
