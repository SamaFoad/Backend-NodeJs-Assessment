export default interface HttpClient {
  get<T = unknown>(urlOrConfig: MethodConfig | string): Promise<Response<T>>;
  post<T = unknown>(urlOrConfig: MethodConfig | string): Promise<Response<T>>;
  put<T = unknown>(urlOrConfig: MethodConfig | string): Promise<Response<T>>;
  patch<T = unknown>(urlOrConfig: MethodConfig | string): Promise<Response<T>>;
  delete<T = unknown>(urlOrConfig: MethodConfig | string): Promise<Response<T>>;
}

export interface MethodConfig {
  url: string;
  headers?: Record<string, unknown>;
  query?: Record<string, unknown>;
  timeout?: number;
  body?: Record<string, unknown> | FormData | string;
}

export interface Response<T> {
  data: T;
  status: number;
  headers: Record<string, unknown>;
}
