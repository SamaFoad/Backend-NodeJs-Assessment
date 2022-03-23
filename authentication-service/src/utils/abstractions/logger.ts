export default interface Logger {
  error: LogMethod;
  warn: LogMethod;
  info: LogMethod;
  debug: LogMethod;
  http: LogMethod;
  verbose: LogMethod;
  silly: LogMethod;

  setName: (name: string) => Logger;
}

interface LogMethod {
  (message: string): Logger;
  (payloadOrError: unknown | Error): Logger;
  (message: string, payloadOrError: unknown | Error): Logger;
  (error: Error, payload: unknown): Logger;
  (message: string, error: Error, payload: unknown): Logger;
}
