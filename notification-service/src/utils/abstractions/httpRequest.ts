import File from './file';
import HttpRequestMethod from './httpRequestMethod';

export default interface HttpRequest {
  body: Record<string, any>;
  rawBody: string;
  path: string;
  queryParams: Record<string, any>;
  pathParams: Record<string, any>;
  method: HttpRequestMethod;
  headers: Record<string, any>;
  cookies: Record<string, any>;
  files: File[];
}
