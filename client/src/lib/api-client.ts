import { env } from "../config/env";
import { ApiRequestError } from "./api-error";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
};

const buildUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${env.apiBaseUrl}${normalizedPath}`;
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}) => {
  const headers = new Headers(options.headers);

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const body = options.body;
  const isFormData = body instanceof FormData;
  if (body !== undefined && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const requestBody: BodyInit | undefined = isFormData ? body : body === undefined ? undefined : JSON.stringify(body);

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    body: requestBody,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String(payload.message)
        : `Request failed with status ${response.status}.`;
    throw new ApiRequestError(message, response.status);
  }

  return payload as T;
};
