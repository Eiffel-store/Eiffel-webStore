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
  }
};
