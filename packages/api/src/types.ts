export interface ApiResponse<T = unknown> {
  data: T;
  error: string | null;
  message: string | null;
  success: boolean;
  timestamp: number;
}

export type Pageable<T = unknown> = T & {
  pagination: {
    page: number /** 기본값 = 1, 1부터 시작 */;
    size: number /** 기본값 = 10, 최대 50*/;
    totalElements: number;
    totalPages: number;
    isFirst: boolean;
    isLast: boolean;
  };
};
