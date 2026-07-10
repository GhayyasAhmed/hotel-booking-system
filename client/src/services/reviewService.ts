import { apiRequest } from "../lib/api-client";
import { type ApiSuccess, type Review } from "../types/api";

export type ReviewPayload = {
  booking: string;
  rating: number;
  title?: string;
  comment: string;
};

export type UpdateReviewPayload = Partial<Pick<ReviewPayload, "rating" | "title" | "comment">>;

export const reviewService = {
  create: (payload: ReviewPayload, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; review: Review }>>("/api/review", {
      method: "POST",
      token,
      body: payload,
    }),

  getAll: (params?: { hotel?: string; room?: string; user?: string }) => {
    const search = new URLSearchParams();
    if (params?.hotel) search.set("hotel", params.hotel);
    if (params?.room) search.set("room", params.room);
    if (params?.user) search.set("user", params.user);

    const query = search.toString() ? `?${search.toString()}` : "";
    return apiRequest<ApiSuccess<{ count: number; reviews: Review[] }>>(`/api/review${query}`);
  },

  getMyReviews: (token: string | null) =>
    apiRequest<ApiSuccess<{ count: number; reviews: Review[] }>>("/api/review/my-reviews", {
      token,
    }),

  getById: (reviewId: string) => apiRequest<ApiSuccess<{ review: Review }>>(`/api/review/${reviewId}`),

  update: (reviewId: string, payload: UpdateReviewPayload, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; review: Review }>>(`/api/review/${reviewId}`, {
      method: "PATCH",
      token,
      body: payload,
    }),

  delete: (reviewId: string, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string }>>(`/api/review/${reviewId}`, {
      method: "DELETE",
      token,
    }),
};
