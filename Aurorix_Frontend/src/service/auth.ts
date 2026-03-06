import { httpService } from "./http";
import type { AuthResponse, LoginCredentials, RegisterCredentials, ApiResponse } from "@/type";

// Auth endpoints
const AUTH_API = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  VERIFY: "/auth/verify",
};

// Auth Service
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await httpService.post<ApiResponse<AuthResponse["data"]>>(
      AUTH_API.LOGIN,
      credentials
    );

    if (response.success && response.data) {
      return {
        success: true,
        message: "Login successful",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Login failed",
    };
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await httpService.post<ApiResponse<AuthResponse["data"]>>(
      AUTH_API.REGISTER,
      credentials
    );

    if (response.success && response.data) {
      return {
        success: true,
        message: "Registration successful",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Registration failed",
    };
  },

  logout: async (): Promise<void> => {
    await httpService.post(AUTH_API.LOGOUT);
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      const response = await httpService.post<ApiResponse<{ valid: boolean }>>(AUTH_API.VERIFY);
      return response.success && response.data?.valid === true;
    } catch {
      return false;
    }
  },

  refreshToken: async (): Promise<boolean> => {
    try {
      const response = await httpService.post<ApiResponse<{ token: string }>>(AUTH_API.REFRESH);
      return response.success && !!response.data?.token;
    } catch {
      return false;
    }
  },
};
