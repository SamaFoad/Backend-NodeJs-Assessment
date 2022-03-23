import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";

interface InstanceConfig {
  baseUrl?: string;
  headers?: object;
  query?: object;
  timeout?: number;
}

interface MethodConfig {
  url: string;
  headers?: object;
  query?: object;
  timeout?: number;
  responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";
}

interface MethodAcceptingBodyConfig extends MethodConfig {
  body?: object | FormData | string;
}

type Method = "get" | "post" | "put" | "patch" | "delete";

interface Config extends MethodAcceptingBodyConfig {
  method: Method;
}

interface Response<T = unknown> {
  data: T;
  status: number;
  headers: object;
  config: Config;
}

type PreRequestCallback = (config: Config) => Config;

type PreResponseCallback = (response: Response) => Response;

class HttpClient {
  private axiosInstance: AxiosInstance;

  static ConfigError = class ConfigError extends Error {
    config: Config;

    constructor(config: Config) {
      super("Invalid configuration");

      this.name = "HttpClient::MethodConfigException";
      this.config = config;
    }
  };

  static ErrorWithoutResponse = class ErrorWithoutResponse extends Error {
    constructor() {
      super("Target didn't respond");

      this.name = "HttpClient::ExceptionWithoutResponse";
    }
  };

  static ErrorWithResponse = class ErrorWithResponse<T> extends Error {
    response: Response<T>;

    constructor(response: Response<T>) {
      super("Target returned an error");

      this.name = "HttpClient::ExceptionWithResponse";
      this.response = response;
    }
  };

  private preRequestCallbacks: PreRequestCallback[] = [];

  constructor(opts: InstanceConfig = {}) {
    this.axiosInstance = axios.create({
      baseURL: opts.baseUrl,
      headers: opts.headers,
      timeout: opts.timeout,
      params: opts.query,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: "comma" });
      },
    });
  }

  // Axios has an issue in preserving order of request interceptors so I am using a manual method
  // https://github.com/axios/axios/issues/841

  // Before sending request
  preRequest(callback: PreRequestCallback) {
    this.preRequestCallbacks.push(callback);
  }

  // Before delivering response
  preResponse(callback: PreResponseCallback) {
    this.axiosInstance.interceptors.response.use(
      (axiosResponse: AxiosResponse) => {
        const response: Response = callback({
          data: axiosResponse.data,
          headers: axiosResponse.headers,
          status: axiosResponse.status,
          config: {
            url: axiosResponse.config.url as string,
            method: axiosResponse.config.method as Method,
            headers: axiosResponse.config.headers,
            query: axiosResponse.config.params,
            timeout: axiosResponse.config.timeout,
            body: axiosResponse.config.data,
          },
        });

        axiosResponse.data = response.data;
        axiosResponse.headers = response.headers;
        axiosResponse.status = response.status;
        axiosResponse.config.url = response.config.url;
        axiosResponse.config.method = response.config.method;
        axiosResponse.config.headers = response.config.headers;
        axiosResponse.config.params = response.config.query;
        axiosResponse.config.timeout = response.config.timeout;
        axiosResponse.config.data = response.config.body;
        return axiosResponse;
      }
    );
  }

  private async execute<T>(config: Config): Promise<Response<T>> {
    this.preRequestCallbacks.forEach((callback) => {
      try {
        config = callback(config);
      } catch (error: any) {}
    });

    try {
      const opts = {
        method: config.method,
        url: config.url,
        headers: config.headers,
        data: config.body,
        params: config.query,
        timeout: config.timeout,
        responseType: config.responseType,
      };
      if (["get", "delete"].includes(config.method)) delete opts.data;

      const response = await this.axiosInstance.request<T, Response<T>>(opts);

      return {
        data: response.data,
        headers: response.headers,
        status: response.status,
        config: config,
      };
    } catch (error: any) {
      if (error.response)
        throw new HttpClient.ErrorWithResponse<T>({
          status: error.response.status,
          headers: error.response.headers,
          data: error.response.data,
          config: config,
        });
      else if (error.request) throw new HttpClient.ErrorWithoutResponse();
      else throw new HttpClient.ConfigError(config);
    }
  }

  async get<T = unknown>(url: string): Promise<Response<T>>;
  async get<T = unknown>(config: MethodConfig): Promise<Response<T>>;
  async get<T = unknown>(
    urlOrConfig: MethodConfig | string
  ): Promise<Response<T>> {
    if (typeof urlOrConfig == "string")
      return await this.execute<T>({ method: "get", url: urlOrConfig });
    else return await this.execute<T>({ method: "get", ...urlOrConfig });
  }

  async post<T = unknown>(url: string): Promise<Response<T>>;
  async post<T = unknown>(
    config: MethodAcceptingBodyConfig
  ): Promise<Response<T>>;
  async post<T = unknown>(
    urlOrConfig: MethodAcceptingBodyConfig | string
  ): Promise<Response<T>> {
    if (typeof urlOrConfig == "string")
      return await this.execute<T>({ method: "post", url: urlOrConfig });
    else return await this.execute<T>({ method: "post", ...urlOrConfig });
  }

  async put<T = unknown>(url: string): Promise<Response<T>>;
  async put<T = unknown>(
    config: MethodAcceptingBodyConfig
  ): Promise<Response<T>>;
  async put<T = unknown>(
    urlOrConfig: MethodAcceptingBodyConfig | string
  ): Promise<Response<T>> {
    if (typeof urlOrConfig == "string")
      return await this.execute<T>({ method: "put", url: urlOrConfig });
    else return await this.execute<T>({ method: "put", ...urlOrConfig });
  }

  async patch<T = unknown>(url: string): Promise<Response<T>>;
  async patch<T = unknown>(
    config: MethodAcceptingBodyConfig
  ): Promise<Response<T>>;
  async patch<T = unknown>(
    urlOrConfig: MethodAcceptingBodyConfig | string
  ): Promise<Response<T>> {
    if (typeof urlOrConfig == "string")
      return await this.execute<T>({ method: "patch", url: urlOrConfig });
    else return await this.execute<T>({ method: "patch", ...urlOrConfig });
  }

  async delete<T = unknown>(url: string): Promise<Response<T>>;
  async delete<T = unknown>(config: MethodConfig): Promise<Response<T>>;
  async delete<T = unknown>(
    urlOrConfig: MethodConfig | string
  ): Promise<Response<T>> {
    if (typeof urlOrConfig == "string")
      return await this.execute<T>({ method: "delete", url: urlOrConfig });
    else return await this.execute<T>({ method: "delete", ...urlOrConfig });
  }
}

export = HttpClient;
