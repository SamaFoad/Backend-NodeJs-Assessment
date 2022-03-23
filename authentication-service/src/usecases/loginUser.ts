import { NotificationCreationAttributes } from './../../../notification-service/src/infrastructure/models/notification-model';
import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import BaseUseCase from '../utils/abstractions/baseUseCase';
import UserRepository from '../infrastructure/repositories/UserRepository';
import { UserCreationAttributes } from '../infrastructure/models/user-model';
import OrmException from '../exceptions/OrmException';
import crypto from 'crypto';
import jwt from "jsonwebtoken";

@injectable()
export default class LoginUserUseCase extends BaseUseCase<CreateUserUseCaseInput, CreateUserUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private userRepository: UserRepository) {
    super();
    this.logger.setName('LoginUserUseCase');
  }
  async execute(params: CreateUserUseCaseInput, presenter: IPresenter<CreateUserUseCaseOutput>): Promise<void> {
    if(!params.UserCreationAttributes.email) return presenter.showMissingArgumentError('email');
    if(!params.UserCreationAttributes.password) presenter.showMissingArgumentError("password");
    await this.run(params, presenter);
  }
  async run(params: CreateUserUseCaseInput, presenter: IPresenter<CreateUserUseCaseOutput>): Promise<void> {
    try {
      let user:UserCreationAttributes;

      // fetch user if exists
      params.UserCreationAttributes.password = crypto.createHash('md5').update(process.env.HASH_SECRET).digest('hex');
      user = await this.userRepository.fetchUser(params.UserCreationAttributes);
      const accessToken = jwt.sign({userId: user.id, email: user.email}, process.env.HASH_SECRET)
      presenter.show(user, accessToken);
    } catch (error) {
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      return presenter.showNotSupportedError('Not Supported Error');
    }
  }
}

export type CreateUserUseCaseInput = {UserCreationAttributes: any};

export type CreateUserUseCaseOutput = {};
