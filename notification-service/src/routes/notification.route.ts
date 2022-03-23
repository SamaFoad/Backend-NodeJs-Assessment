import { injectable } from 'tsyringe';
import { Router as ExpressRouter } from 'express';
import { Request, Response, NextFunction } from 'express';
import IRoute from '../utils/abstractions/route';
import CreateNotificationController from '../controllers/createNotification';
import GetNotificationController from '../controllers/getNotification';
import GetNotificationsController from '../controllers/getNotifications';

@injectable()
class NotificationsRoute implements IRoute {
  public path = '/notifications';
  public router = ExpressRouter();

  constructor(
    private createNotification: CreateNotificationController,
    private getNotification: GetNotificationController,
    private getNotifications: GetNotificationsController,
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, (req: Request, res: Response, next: NextFunction) => new GetNotificationController().middleware()(req, res, next));
    this.router.get(`${this.path}`, (req: Request, res: Response, next: NextFunction) => new GetNotificationsController().middleware()(req, res, next));
    this.router.post(`${this.path}`, (req: Request, res: Response, next: NextFunction) => new CreateNotificationController().middleware()(req, res, next));
  }
}

export default NotificationsRoute;
