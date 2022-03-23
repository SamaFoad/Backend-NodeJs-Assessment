import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import BaseUseCase from '../utils/abstractions/baseUseCase';
import NotificationRepository from '../infrastructure/repositories/NotificationRepository';
import OrmException from '../exceptions/OrmException';

@injectable()
export default class FetchNotificationUseCase extends BaseUseCase<FetchNotificationUseCaseInput, FetchNotificationUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private notificationRepository: NotificationRepository) {
    super();
    logger.setName('FetchNotificationUseCase');
  }
  async execute(params: FetchNotificationUseCaseInput, presenter: IPresenter<FetchNotificationUseCaseOutput>): Promise<void> {
    if (!params.id) return presenter.showMissingArgumentError('id');
    await this.run(params, presenter);
  }
  async run(params: FetchNotificationUseCaseInput, presenter: IPresenter<FetchNotificationUseCaseOutput>): Promise<void> {
    try {
      const notification = await this.notificationRepository.fetchNotificationById(parseInt(params.id));
      if (notification == null) {
        presenter.showNotFoundError();
        return;
      }
      presenter.show(notification);
    } catch (error) {
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      throw error;
    }
  }
}

export interface FetchNotificationUseCaseInput {
  id: string;
}

export type FetchNotificationUseCaseOutput = {};
