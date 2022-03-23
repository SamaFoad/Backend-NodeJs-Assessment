import { Request, Response, NextFunction, Express } from 'express';
import { Multer } from 'multer';
import IHttpRequest from './httpRequest';
import IFile from './file';
import IHttpRequestMethod from './httpRequestMethod';
import IPresenter from './presenter';

// In case of a web service a controller is also a presenter
export default abstract class Controller<T = any> implements IPresenter<T> {
  protected httpRequest: IHttpRequest;
  protected req: Request;
  protected res: Response;
  private isOutputWritten = false;

  public middleware(): (req: Request, res: Response, next: NextFunction) => void {
    return (req, res, next) => {
      this.isOutputWritten = false;
      this.req = req;
      this.res = res;
      this.httpRequest = this.makeHttpRequest(req);
      this.execute(this.httpRequest).catch(error => next(error));
    };
  }

  protected abstract execute(httpRequest: IHttpRequest): Promise<void>;

  protected makeHttpRequest(req: Request): IHttpRequest {
    return {
      method: this.getReqMethod(req),
      path: req.path,
      pathParams: req.params,
      queryParams: req.query,
      body: req.body,
      rawBody: this.res.locals.rawBody,
      headers: req.headers,
      cookies: req.cookies,
      files: this.parseFiles(req),
    };
  }

  protected parseFiles(req: Request): IFile[] {
    let files: Express.Multer.File[] = [];

    if (req.files) files = req.files as Express.Multer.File[];
    if (req.file) files.push(req.file);

    return files.map(file => {
      return { path: file.path, size: file.size, mime: file.mimetype, filename: file.filename, encoding: file.encoding };
    });
  }

  protected getReqMethod(req: Request): IHttpRequestMethod {
    switch (req.method) {
      case 'GET':
        return 'get';
      case 'POST':
        return 'post';
      case 'PUT':
        return 'put';
      case 'PATCH':
        return 'patch';
      case 'DELETE':
        return 'delete';
    }
  }

  show(lite: T, original?: Record<string, any>): void {
    this.send(200, { service: process.env.CHANNEL_NAME.toLowerCase(), liteResponse: lite, originalResponse: original });
  }

  showMissingArgumentError(argName: string | string[]): void {
    if (Array.isArray(argName))
      this.send(400, {
        error: { message: `Please provide one of ${argName.map(v => this.mapUseCaseParamToExpressParam(v)).join(',')}`, code: 1000, subcode: 1 },
      });
    else this.send(400, { error: { message: `Missing argument ${this.mapUseCaseParamToExpressParam(argName)}`, code: 1000, subcode: 1 } });
  }

  showInvalidArgumentError(argName: string, expected: string): void {
    this.send(400, {
      error: { message: `Invalid argument ${this.mapUseCaseParamToExpressParam(argName)}. ${expected} is expected`, code: 1000, subcode: 2 },
    });
  }

  showFileSizeTooLargeError(maxSize: string) {
    this.send(400, {
      error: { message: `File size is too large. Maximum of ${maxSize} is expected`, code: 1000, subcode: 3 },
    });
  }

  showPaginationNotSupportedError(type: string): void {
    this.send(400, { error: { message: `${type} pagination is not supported`, code: 1100, subcode: 1 } });
  }

  showNotSupportedError(thing: string): void {
    this.send(400, { error: { message: `${thing} is not supported`, code: 1100, subcode: 2 } });
  }

  showOauthStateParseError(): void {
    this.send(401, { error: { message: `Couldn't parse oauth state`, code: 1200, subcode: 1 } });
  }

  showServiceUnreachableError(name: string): void {
    this.send(504, { error: { message: `${name} is unreachable`, code: 1300, subcode: 1 } });
  }

  showSocialCredentialsError(): void {
    this.send(401, { error: { message: `Invalid social credentials`, code: 1400, subcode: 1 } });
  }

  showNotFoundError(): void {
    this.send(404, { error: { message: `Resource not found`, code: 1500, subcode: 1 } });
  }
  
  showDatabaseError(errorMessage: string, resourceName: string): void {
    this.send(400, { error: { message: errorMessage, resourceName: resourceName, code: 1600, subcode: 1 } });
  }

  // Override this if you need to show different arg names in error messages
  protected mapUseCaseParamToExpressParam(param: string) {
    return param;
  }

  protected send(status: number, body: unknown) {
    if (!this.isOutputWritten) {
      this.res.status(status).send(body);
      this.isOutputWritten = true;
    }
  }
}
