import User, { UserInstance, UserCreationAttributes } from '../models/user-model';
import { Logger } from 'logging';
import RedisClient from 'redis-client';
import { injectable } from 'tsyringe';
import { BaseError, Op } from 'sequelize';
import OrmException from '../../exceptions/OrmException';

@injectable()
export default class UserRepository {
  constructor(private logger?: Logger, private cache?: RedisClient) {}

  public async fetchUserById(id: number): Promise<UserInstance> {
    try {
      return await User.findByPk(id);
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async fetchUser(user: UserCreationAttributes): Promise<UserInstance> {
    try {
      return await User.findOne({
        where: {
          email: user.email,
          password: user.password
        }
      });
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async getAllByPage(page: number, page_limit: number, sortBy: string): Promise<{ rows: UserInstance[]; count: number }> {
    try {
      const offset: number = page * page_limit;
      return await User.findAndCountAll({ limit: page_limit, offset: offset, order: [[sortBy, 'DESC']] });
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async createUser(user: UserCreationAttributes): Promise<UserInstance> {
    try {
      return await User.create(user)
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async updateUserPassword(id: number, user: any): Promise<UserInstance> {
    try {
      const options: any = { where: { id: id }, returning: true };
      await User.update(user, options);
      return await User.findOne({
        where: { id: id },
      });
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  public async deleteUser(id: number): Promise<number> {
    try {
      const options: any = { where: { id: id } };
      return await User.destroy(options);
    } catch (error) {
      this.catchingDatabaseError(error);
    }
  }

  private catchingDatabaseError(error: any): any {
    if (error instanceof BaseError) {
      throw new OrmException(error.message, 'Users');
    }
    throw error;
  }
}
