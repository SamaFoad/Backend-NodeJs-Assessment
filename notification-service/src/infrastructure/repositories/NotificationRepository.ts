import Notification, { NotificationInstance, NotificationCreationAttributes } from '../models/notification-model';
import { Logger } from 'logging';
import RedisClient from 'redis-client';
import { injectable } from 'tsyringe';
import { BaseError, Op } from 'sequelize';
import OrmException from '../../exceptions/OrmException';

@injectable()
export default class NotificationRepository {
  constructor(private logger: Logger, private cache: RedisClient) {}

  public async fetchNotificationById(id: number): Promise<NotificationInstance> {
    try {
      return await Notification.findByPk(id);
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async getAllByPage(page: number, page_limit: number, sortBy: string): Promise<{ rows: NotificationInstance[]; count: number }> {
    try {
      // filters = this.objectCleaner(filters);
      // const patternMatchingFilters: any = {};
      // for (const key in filters) {
      //   if (Object.prototype.hasOwnProperty.call(filters, key)) {
      //     const element = filters[key];
      //     if (['userId', 'action'].indexOf(key) >= 0) {
      //       patternMatchingFilters[key] = element;
      //       continue;
      //     }
      //     patternMatchingFilters[key] = { [Op.iLike]: `%${element}%` };
      //   }
      // }
      const offset: number = page * page_limit;
      return await Notification.findAndCountAll({ limit: page_limit, offset: offset, order: [[sortBy, 'DESC']] });
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async createNotifications(notifications: NotificationCreationAttributes[]): Promise<NotificationInstance[]> {
    try {
      return await Notification.bulkCreate(notifications)
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async createNotification(notification: NotificationCreationAttributes): Promise<NotificationInstance> {
    try {
      return await Notification.create(notification)
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async updateIsSentNotification(id: number, notification: any): Promise<NotificationInstance> {
    try {
      const options: any = { where: { id: id }, returning: true };
      await Notification.update(notification, options);
      return await Notification.findOne({
        where: { id: id },
      });
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  private catchingDatabaseError(error: any): any {
    if (error instanceof BaseError) {
      throw new OrmException(error.message, 'Notifications');
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
