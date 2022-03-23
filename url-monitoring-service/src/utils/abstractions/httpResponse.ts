export default interface HttpResponse {
  status: number;
  body: Record<string, unknown>;
}
