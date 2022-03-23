import { injectable } from 'tsyringe';
import { Router as ExpressRouter } from 'express';
import { Request, Response, NextFunction } from 'express';
import IRoute from '../utils/abstractions/route';
import RegisterUserController from '../controllers/registerUser';
import GetUserController from '../controllers/getUser';
import GetUsersController from '../controllers/getUsers';
import DeleteUserController from '../controllers/deleteUser';
import LoginUserController from '../controllers/loginUser';

@injectable()
class UsersRoute implements IRoute {
  public path = '/users';
  public router = ExpressRouter();

  constructor(
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, (req: Request, res: Response, next: NextFunction) => new GetUserController().middleware()(req, res, next));
    this.router.get(`${this.path}`, (req: Request, res: Response, next: NextFunction) => new GetUsersController().middleware()(req, res, next));
    this.router.post(`${this.path}/login`, (req: Request, res: Response, next: NextFunction) => new LoginUserController().middleware()(req, res, next));
    this.router.post(`${this.path}/sign-up`, (req: Request, res: Response, next: NextFunction) => new RegisterUserController().middleware()(req, res, next));
    this.router.delete(`${this.path}/:id`, (req: Request, res: Response, next: NextFunction) => new DeleteUserController().middleware()(req, res, next));
  }
}

export default UsersRoute;
