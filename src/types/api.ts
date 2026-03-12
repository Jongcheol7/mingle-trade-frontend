export type ApiResponse<T = unknown> = {
  status: "success" | "error";
  data: T;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  lists: T[];
  total: number;
}>;
