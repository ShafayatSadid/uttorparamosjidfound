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


export async function downloadPDF(endpoint: string, filename: string) {
  const { data: tokenData } = await authClient.token();
  
  if (!tokenData?.token) {
    throw new Error("Unauthorized - No token found");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${tokenData.token}`,
    },
  });

  if (!response.ok) {
    throw new Error("PDF ডাউনলোড করতে সমস্যা হয়েছে");
  }

  // PDF কে Blob হিসেবে নেওয়া
  const blob = await response.blob();
  
  // ব্রাউজারে ডাউনলোড ট্রিগার করা
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}


export async function fetchPublic(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch public data");
  }

  return response.json();
}