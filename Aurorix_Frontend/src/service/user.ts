import { httpService } from "./http";
import type { User, ApiResponse } from "@/type";

// User endpoints
const USER_API = {
  PROFILE: "/users/profile",
  UPDATE_PROFILE: "/users/profile",
  DELETE_ACCOUNT: "/users/account",
};

// User Service
export const userService = {
  getProfile: async (): Promise<User | null> => {
    const response = await httpService.get<ApiResponse<User>>(USER_API.PROFILE);

    if (response.success && response.data) {
      return response.data;
    }

    return null;
  },

  updateProfile: async (data: Partial<User>): Promise<User | null> => {
    const response = await httpService.put<ApiResponse<User>>(USER_API.UPDATE_PROFILE, data);

    if (response.success && response.data) {
      return response.data;
    }

    return null;
  },

  deleteAccount: async (): Promise<boolean> => {
    try {
      await httpService.delete(USER_API.DELETE_ACCOUNT);
      return true;
    } catch {
      return false;
    }
  },
};
