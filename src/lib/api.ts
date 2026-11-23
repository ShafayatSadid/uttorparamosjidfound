import { authClient } from "./auth-client";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Better Auth থেকে JWT টোকেন নেওয়া
  const { data: tokenData } = await authClient.token();
  
  if (!tokenData?.token) {
    throw new Error("Unauthorized - No token found");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenData.token}`,
    ...options.headers,
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Something went wrong");
  }

  return response.json();
}