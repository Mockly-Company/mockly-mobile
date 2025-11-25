export interface ApiResponse<T = unknown> {
  data: T;
  error: string | null;
  message: string | null;
  success: boolean;
  timestamp: number;
}
