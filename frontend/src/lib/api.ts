/**
 * Thin client for the Azentra admin API.
 *
 * The backend does not exist yet — these calls target
 * `NEXT_PUBLIC_API_URL` (see `.env.local`) and will surface a network error
 * until it is running. Swap the endpoints if the backend settles on
 * different paths.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export class ApiError extends Error {}

async function post<T>(path: string, body: unknown): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "Could not reach the server. Please check your connection and try again.",
    );
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message: unknown }).message)
        : "Something went wrong. Please try again.";
    throw new ApiError(message);
  }

  return payload as T;
}

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export function login(payload: LoginPayload) {
  return post<{ token: string }>("/auth/login", payload);
}

export type RegisterComplexPayload = {
  complexName: string;
  address: string;
  contactName: string;
  email: string;
  phone: string;
  password: string;
};

export function registerComplex(payload: RegisterComplexPayload) {
  return post<{ id: string }>("/auth/register", payload);
}
