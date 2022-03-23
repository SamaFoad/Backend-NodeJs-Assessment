import UrlMonitor, { UrlMonitorInstance, UrlMonitorCreationAttributes } from '../models/url-monitor-model';
import { Logger } from 'logging';
import RedisClient from 'redis-client';
import { injectable } from 'tsyringe';
import { BaseError, Op } from 'sequelize';
import OrmException from '../../exceptions/OrmException';

@injectable()
export default class URLMonitorRepository {
  constructor(private logger: Logger, private cache: RedisClient) {}

  public async fetchMonitorByURL(url: string): Promise<UrlMonitorInstance> {
    try {
      return await UrlMonitor.findOne({
        where: { url: url }
      });
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async fetchMonitorById(id: number): Promise<UrlMonitorInstance> {
    try {
      return await UrlMonitor.findOne({
        where: { id: id }
      });
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async fetchMonitorByUserId(id: number): Promise<UrlMonitorInstance[]> {
    try {
      console.debug("Innnnnnnnnnn fetchMonitorByUserId")
      return await UrlMonitor.findAll({
        where: { userId: id}
      })
    } catch (error) {
      console.debug(error);
      this.catchingDatabaseError(error);
    }
  }

  public async getAllByPage(page: number, page_limit: number, sortBy: string): Promise<{ rows: UrlMonitorInstance[]; count: number }> {
    try {
      const offset: number = page * page_limit;
      return await UrlMonitor.findAndCountAll({ limit: page_limit, offset: offset, order: [[sortBy, 'DESC']] });
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async createUrlMonitors(urlMonitors: UrlMonitorCreationAttributes[]): Promise<UrlMonitorInstance[]> {
    try {
      return await UrlMonitor.bulkCreate(urlMonitors)
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async createUrlMonitor(urlMonitor: UrlMonitorCreationAttributes): Promise<UrlMonitorInstance> {
    try {
      return await UrlMonitor.create({
        url: urlMonitor.url,
        status: urlMonitor.status ? urlMonitor.status : 'UP',
        name: urlMonitor.name,
        numberOfUps: urlMonitor.numberOfUps,
        numberOfDowns: urlMonitor.numberOfDowns,
        userId: urlMonitor.userId
      });
    } catch (error) {
      console.debug(error);
      this.catchingDatabaseError(error);
    }
  }

  public async updateUrlMonitor(urlMonitor: UrlMonitorCreationAttributes): Promise<UrlMonitorInstance> {
    try {
      const options: any = { where: { url: urlMonitor.url }, returning: true };
      await UrlMonitor.update({
        url: urlMonitor.url,
        status: urlMonitor.status,
        name: urlMonitor.name,
        numberOfUps: urlMonitor.numberOfUps,
        numberOfDowns: urlMonitor.numberOfDowns,
        userId: urlMonitor.userId
      }, options);
      return await UrlMonitor.findOne({
        where: { url: urlMonitor.url },
      });
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async deleteUrlMonitor(id: number): Promise<number> {
    try {
      const options: any = { where: { id: id } };
      return await UrlMonitor.destroy(options);
    } catch (error) {
      console.debug(error);
      // this.logger.error(ErrorLog.DELETE_DATA.replace('%s', 'UrlMonitor'), error);
      // this.catchingCommonErrors(error);
    }
  }

  private catchingDatabaseError(error: any): any {
    if (error instanceof BaseError) {
      throw new OrmException(error.message, 'UrlMonitors');
    }
    throw error;
  }
  private objectCleaner(obj: any): any {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }
}
