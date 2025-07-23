import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
}

// Custom API request function for authentication
const authApiRequest = async (url: string, method = "GET", body?: any, headers?: Record<string, string>) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || `${response.status}: ${response.statusText}`;
    } catch {
      errorMessage = `${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    setToken(storedToken);
  }, []);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      if (!token) return null;
      
      try {
        const response = await authApiRequest("/api/auth/user", "GET", undefined, {
          Authorization: `Bearer ${token}`,
        });
        return response as AuthUser;
      } catch (error: any) {
        // If token is invalid, remove it
        if (error.message.includes("401") || error.message.includes("403")) {
          localStorage.removeItem("auth_token");
          setToken(null);
        }
        throw error;
      }
    },
    enabled: !!token,
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    window.location.href = "/";
  };

  return {
    user,
    isLoading: isLoading && !!token,
    isAuthenticated: !!user && !!token,
    token,
    logout,
    error,
  };
}