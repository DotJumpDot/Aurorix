export interface ApiError {
  success: false;
  message: string;
  code?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T> = ApiError | ApiSuccess<T>;
