declare namespace BaseResponse {
  interface Root<T> {
    data?: T;
    message?: string;
    statusCode?: number;
    success?: boolean;
  }
}
