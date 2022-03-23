import { Request, Response, NextFunction } from "express";

declare namespace Logging {
  interface LogMethod {
    (level: string, message: string): Logger;
    (level: string, payloadOrError: object): Logger;
    (level: string, message: string, payloadOrError: object): Logger;
    (level: string, error: object, payload: object): Logger;
    (level: string, message: string, error: object, payload: object): Logger;
  }

  interface LeveledLogMethod {
    (message: string): Logger;
    (payloadOrError: unknown | Error): Logger;
    (message: string, payloadOrError: unknown | Error): Logger;
    (error: Error, payload: unknown): Logger;
    (message: string, error: Error, payload: unknown): Logger;
  }

  class Logger {
    constructor(name?: string, defaultMeta?: object);

    setName: (name: string) => Logger;

    log: LogMethod;

    error: LeveledLogMethod;
    warn: LeveledLogMethod;
    info: LeveledLogMethod;
    debug: LeveledLogMethod;
    http: LeveledLogMethod;
    verbose: LeveledLogMethod;
    silly: LeveledLogMethod;
  }

  let setLogLevel: (level: string) => boolean;
  let startDebugging: () => void;
  let stopDebugging: () => void;
  let debugFor: (seconds?: number) => void;
  let debugSessionActive: () => boolean;
  let requestLoggingMiddleware: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
}

export = Logging;
