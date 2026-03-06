import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { session } from "@/store/localstorage";

// API Base URL - can be configured via environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4200";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "1234";

// Create axios instance
const http: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor - add auth token
const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  // Get token from session storage
  const token = session.getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Get API key from storage
  const apiKey = API_KEY;

  if (apiKey && config.headers) {
    config.headers["X-API-Key"] = apiKey;
  }

  return config;
};

// Response interceptor - handle errors
const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

// Error handler
const errorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const { response } = error;

    if (response) {
      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Unauthorized - clear session
          session.clear();
          console.error("Unauthorized - Please login again");
          break;
        case 403:
          console.error("Forbidden - You do not have permission");
          break;
        case 404:
          console.error("Not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("Request failed:", response.data?.message || error.message);
      }

      return Promise.reject(response.data);
    } else if (error.request) {
      // Network error
      console.error("Network error - Please check your connection");
      return Promise.reject({ message: "Network error" });
    }
  }

  return Promise.reject(error);
};

// Add interceptors
http.interceptors.request.use(requestInterceptor, (error) => {
  return Promise.reject(error);
});

http.interceptors.response.use(responseInterceptor, errorHandler);

// HTTP Methods
export const httpService = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return http.get<T>(url, config).then((res) => res.data);
  },

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return http.post<T>(url, data, config).then((res) => res.data);
  },

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return http.put<T>(url, data, config).then((res) => res.data);
  },

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    return http.patch<T>(url, data, config).then((res) => res.data);
  },

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return http.delete<T>(url, config).then((res) => res.data);
  },
};

export { session };

export default http;
