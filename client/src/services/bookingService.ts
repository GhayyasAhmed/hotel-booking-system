import { apiRequest } from "../lib/api-client";
import { type ApiSuccess, type Booking, type BookingStatus } from "../types/api";

export type BookingPayload = {
  room: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
};

export type UpdateBookingPayload = Partial<Pick<BookingPayload, "checkInDate" | "checkOutDate" | "guests">> & {
  status?: BookingStatus;
  isPaid?: boolean;
  paymentMethod?: string;
};

export const bookingService = {
  checkAvailability: (payload: Pick<BookingPayload, "room" | "checkInDate" | "checkOutDate">) =>
    apiRequest<ApiSuccess<{ isAvailable: boolean }>>("/api/booking/check-availability", {
      method: "POST",
      body: payload,
    }),

  create: (payload: BookingPayload, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; booking: Booking }>>("/api/booking/book", {
      method: "POST",
      token,
      body: payload,
    }),

  getUserBookings: (token: string | null) =>
    apiRequest<ApiSuccess<{ count: number; bookings: Booking[] }>>("/api/booking/user", {
      token,
    }),

  getHotelBookings: (token: string | null) =>
    apiRequest<ApiSuccess<{ data: { totalBookings: number; totalRevenue: number; bookings: Booking[] } }>>(
      "/api/booking/hotel",
      { token },
    ),

  createStripePayment: (bookingId: string, token: string | null) =>
    apiRequest<ApiSuccess<{ url: string }>>("/api/booking/stripe-payment", {
      method: "POST",
      token,
      body: { bookingId },
    }),

  getById: (bookingId: string, token: string | null) =>
    apiRequest<ApiSuccess<{ booking: Booking }>>(`/api/booking/${bookingId}`, {
      token,
    }),

  update: (bookingId: string, payload: UpdateBookingPayload, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; booking: Booking }>>(`/api/booking/${bookingId}`, {
      method: "PATCH",
      token,
      body: payload,
    }),

  updateStatus: (bookingId: string, status: BookingStatus, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; booking: Booking }>>(`/api/booking/${bookingId}/status`, {
      method: "PATCH",
      token,
      body: { status },
    }),

  cancel: (bookingId: string, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; booking: Booking }>>(`/api/booking/${bookingId}/cancel`, {
      method: "PATCH",
      token,
    }),

  delete: (bookingId: string, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string }>>(`/api/booking/${bookingId}`, {
      method: "DELETE",
      token,
    }),
};
