import { API_BASE_URL, apiRequest } from "@/lib/api";
import { LoginCredentials, LoginResponse } from "@/types/auth";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  
  return apiRequest<LoginResponse>(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}