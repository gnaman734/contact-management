export class ApiResponse<T = any> {
  public success: boolean;
  public message: string;
  public data?: T;
  public pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(success: boolean, message: string, data?: T, pagination?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.pagination = pagination;
  }

  static success<T>(message: string, data?: T, pagination?: any): ApiResponse<T> {
    return new ApiResponse(true, message, data, pagination);
  }

  static error(message: string): ApiResponse {
    return new ApiResponse(false, message);
  }
}