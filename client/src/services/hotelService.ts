import { apiRequest } from "../lib/api-client";
import { type ApiSuccess, type Hotel } from "../types/api";

export type HotelPayload = {
  name: string;
  address: string;
  contact: string;
  city: string;
};

export const hotelService = {
  getAll: (city?: string) => {
    const query = city ? `?city=${encodeURIComponent(city)}` : "";
    return apiRequest<ApiSuccess<{ count: number; hotels: Hotel[] }>>(`/api/hotel${query}`);
  },

  register: (payload: HotelPayload, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; hotel: Hotel }>>("/api/hotel", {
      method: "POST",
      token,
      body: payload,
    }),

  getMyHotel: (token: string | null) =>
    apiRequest<ApiSuccess<{ hotel: Hotel }>>("/api/hotel/my-hotel", {
      token,
    }),

  getById: (hotelId: string) => apiRequest<ApiSuccess<{ hotel: Hotel }>>(`/api/hotel/${hotelId}`),

  update: (hotelId: string, payload: Partial<HotelPayload>, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; hotel: Hotel }>>(`/api/hotel/${hotelId}`, {
      method: "PATCH",
      token,
      body: payload,
    }),

  delete: (hotelId: string, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string }>>(`/api/hotel/${hotelId}`, {
      method: "DELETE",
      token,
    }),
};
