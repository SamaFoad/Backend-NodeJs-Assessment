import { injectable } from 'tsyringe';
import { Router as ExpressRouter } from 'express';
import { Request, Response, NextFunction } from 'express';
import IRoute from '../utils/abstractions/route';
import CreateNotificationController from '../controllers/createUrlMonitor';
import GetNotificationController from '../controllers/getUrlMonitor';
import GetNotificationsController from '../controllers/getUrlsMonitor';
import DeleteUrlMonitorController from '../controllers/deleteUrlMonitor';
import UpdateUrlMonitorController from '../controllers/updateUrlMonitor';
import GetReportController from '../controllers/getReport';

@injectable()
class NotificationsRoute implements IRoute {
  public path = '/url-monitor';
  public router = ExpressRouter();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/report`, (req: Request, res: Response, next: NextFunction) => 
      new GetReportController().middleware()(req, res, next)
    );
    this.router.get(`${this.path}/:id`, (req: Request, res: Response, next: NextFunction) => 
      new GetNotificationController().middleware()(req, res, next)
    );
    this.router.get(`${this.path}`, (req: Request, res: Response, next: NextFunction) => 
      new GetNotificationsController().middleware()(req, res, next)
    );
    this.router.post(`${this.path}`, (req: Request, res: Response, next: NextFunction) => 
      new CreateNotificationController().middleware()(req, res, next)
    );
    this.router.delete(`${this.path}/:id`, (req: Request, res: Response, next: NextFunction) =>
      new DeleteUrlMonitorController().middleware()(req, res, next),
    );
    this.router.put(`${this.path}`, (req: Request, res: Response, next: NextFunction) =>
      new UpdateUrlMonitorController().middleware()(req, res, next),
    );
  }
}

export default NotificationsRoute;
