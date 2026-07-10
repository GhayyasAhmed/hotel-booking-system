import { apiRequest } from "../lib/api-client";
import { type ApiSuccess, type Room } from "../types/api";

export type RoomPayload = {
  roomType: string;
  pricePerNight: number;
  amenities: string[];
  images?: FileList | File[];
};

const toRoomFormData = (payload: Partial<RoomPayload>) => {
  const formData = new FormData();

  if (payload.roomType !== undefined) formData.append("roomType", payload.roomType);
  if (payload.pricePerNight !== undefined) formData.append("pricePerNight", String(payload.pricePerNight));
  if (payload.amenities !== undefined) formData.append("amenities", JSON.stringify(payload.amenities));

  Array.from(payload.images || []).forEach((image) => {
    formData.append("images", image);
  });

  return formData;
};

export const roomService = {
  create: (payload: RoomPayload, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; room: Room }>>("/api/room", {
      method: "POST",
      token,
      body: toRoomFormData(payload),
    }),

  getAll: (params?: { hotel?: string; includeUnavailable?: boolean }) => {
    const search = new URLSearchParams();
    if (params?.hotel) search.set("hotel", params.hotel);
    if (params?.includeUnavailable) search.set("includeUnavailable", "true");

    const query = search.toString() ? `?${search.toString()}` : "";
    return apiRequest<ApiSuccess<{ count: number; rooms: Room[] }>>(`/api/room${query}`);
  },

  getOwnerRooms: (token: string | null) =>
    apiRequest<ApiSuccess<{ count: number; rooms: Room[] }>>("/api/room/owner", {
      token,
    }),

  getById: (roomId: string) => apiRequest<ApiSuccess<{ room: Room }>>(`/api/room/${roomId}`),

  toggleAvailability: (roomId: string, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; room: Room }>>(`/api/room/${roomId}/toggle-availability`, {
      method: "PATCH",
      token,
    }),

  update: (roomId: string, payload: Partial<RoomPayload>, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; room: Room }>>(`/api/room/${roomId}`, {
      method: "PATCH",
      token,
      body: toRoomFormData(payload),
    }),

  delete: (roomId: string, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string }>>(`/api/room/${roomId}`, {
      method: "DELETE",
      token,
    }),
};
