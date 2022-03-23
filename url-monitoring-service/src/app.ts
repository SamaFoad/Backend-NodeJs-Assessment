import 'reflect-metadata';
import { Lifecycle, registry, autoInjectable } from 'tsyringe';
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
// import swaggerJson from '../swagger.json';
import HttpClient from 'http-client';
import RedisClient from 'redis-client';
import { Logger, requestLoggingMiddleware } from 'logging';
import IRoute from './utils/abstractions/route';
import UrlMonitorRoute from './routes/urlMonitor.route';
import URLMonitorRepository from './infrastructure/repositories/URLMonitorRepository';
import * as util from './common/util';

@autoInjectable()
// IOC Container
@registry([
  // Setup 3rd party depencies
  { token: HttpClient, useClass: HttpClient },
  { token: Logger, useClass: Logger },
  { token: URLMonitorRepository, useClass: URLMonitorRepository },
  { token: RedisClient, useClass: RedisClient, options: { lifecycle: Lifecycle.Singleton } },
])
export default class App {
  public app: express.Application;

  constructor(
    protected logger?: Logger,
    protected redisClient?: RedisClient,
    protected UrlMonitorRoute?: UrlMonitorRoute,
  ) {
    logger.setName('App');
    this.app = express();
    this.initializeMiddlewares();
    this.intializeStatus();
    this.initializeRoutes([UrlMonitorRoute]);
    // this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(+process.env.PORT, process.env.HOST, () => {
      this.logger.info(`🚀 ${process.env.CHANNEL_NAME} service is listening on ${process.env.HOST_URL}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (process.env.NODE_ENV === 'production') {
      this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
    } else if (process.env.NODE_ENV === 'development') {
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(requestLoggingMiddleware);
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(
      express.json({
        verify: (req, res: Response, buf) => {
          res.locals.rawBody = buf;
        },
      }),
    );
    this.app.use(
      express.urlencoded({
        extended: true,
        verify: (req, res: Response, buf) => {
          res.locals.rawBody = buf;
        },
      }),
    );
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: IRoute[]) {
    routes.forEach(route => {
      this.app.use(process.env.API_ROOT, route.router);
    });
  }

  // private initializeSwagger() {
  //   this.app.use(`${process.env.API_ROOT}docs`, swaggerUi.serve, swaggerUi.setup(swaggerJson));
  // }

  private intializeStatus() {
    this.app.get(`${process.env.API_ROOT}/audit-logs/status`, function (req, res) {
      res.status(200).send({
        status: 'up',
        service: 'audit-logging',
        uptime: util.toHHMMSS(process.uptime()),
        version: (() => {
          try {
            return process.env.VERSION?.toString();
          } catch (err) {
            return null;
          }
        })(),
      });
    });
  }

  // This is a fallback error handling, if something
  // is not handled properly in usecases this will kick in
  private initializeErrorHandling() {
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      try {
        const message = 'Something went wrong';
        const clone = { ...error };


        this.logger.error(message, error, clone);
        res.status(500).json({ message });
      } catch (error) {
        next(error);
      }
    });
  }
}

// TODO: tests
