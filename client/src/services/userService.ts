import { apiRequest } from "../lib/api-client";
import { type ApiSuccess, type User } from "../types/api";

export type SyncUserPayload = {
  username: string;
  email: string;
  image?: string;
};

export type UpdateUserPayload = Partial<Pick<User, "username" | "email" | "image">>;

export const userService = {
  sync: (payload: SyncUserPayload, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; user: User }>>("/api/user/sync", {
      method: "POST",
      token,
      body: payload,
    }),

  getCurrent: (token: string | null) =>
    apiRequest<ApiSuccess<{ user: User }>>("/api/user", {
      token,
    }),

  updateRole: (role: "user" | "owner", token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; user: User }>>(`/api/user/role/${role}`, {
      method: "PATCH",
      token
    }),
  updateCurrent: (payload: UpdateUserPayload, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; user: User }>>("/api/user", {
      method: "PATCH",
      token,
      body: payload,
    }),

  deleteCurrent: (token: string | null) =>
    apiRequest<ApiSuccess<{ message: string }>>("/api/user", {
      method: "DELETE",
      token,
    }),

  getAll: (token: string | null) =>
    apiRequest<ApiSuccess<{ count: number; users: User[] }>>("/api/user/all", {
      token,
    }),

  storeRecentSearch: (recentSearchedCity: string, token: string | null) =>
    apiRequest<ApiSuccess<{ message: string; recentSearchCities: string[] }>>("/api/user/store-recent-search", {
      method: "POST",
      token,
      body: { recentSearchedCity },
    }),
};
