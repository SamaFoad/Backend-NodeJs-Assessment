import { Router as ExpressRouter } from 'express';

export default interface Route {
  path?: string;
  router: ExpressRouter;
}
