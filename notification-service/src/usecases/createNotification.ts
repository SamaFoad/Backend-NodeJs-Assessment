import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import BaseUseCase from '../utils/abstractions/baseUseCase';
import NotificationRepository from '../infrastructure/repositories/NotificationRepository';
import { NotificationCreationAttributes, NotificationInstance } from '../infrastructure/models/notification-model';
import OrmException from '../exceptions/OrmException';
import sendEmail from '../helpers/mailSender';
import { getDateNow } from '../common/util';
import { ErrorLog } from '../common/constants/logMessages';

@injectable()
export default class CreateNotificationUseCase extends BaseUseCase<CreateNotificationUseCaseInput, CreateNotificationUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private notificationRepository: NotificationRepository) {
    super();
    this.logger.setName('CreateNotificationUseCase');
  }
  async execute(params: CreateNotificationUseCaseInput, presenter: IPresenter<CreateNotificationUseCaseOutput>): Promise<void> {
    await this.run(params, presenter);
  }
  async run(params: CreateNotificationUseCaseInput, presenter: IPresenter<CreateNotificationUseCaseOutput>): Promise<void> {
    try {
      //set sender email from .env file
      let notification:NotificationCreationAttributes;
      params.NotificationCreationAttributes.sender = process.env.SENDER_EMAIL;

      notification = await this.notificationRepository.createNotification(params.NotificationCreationAttributes);
      await sendEmail(params.NotificationCreationAttributes, getDateNow())
      .catch((error) => {
        this.logger.error(ErrorLog.MAIL_SENDER_FAILURE);
        this.logger.error(error);
        presenter.show(notification);
      })
      .then(async () => {
          //reset isSent Email to be true
          params.NotificationCreationAttributes.isSent = true;
          notification = await this.notificationRepository.updateIsSentNotification(notification.id, params.NotificationCreationAttributes);
        }
      );

      presenter.show(notification);
    } catch (error) {
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      throw error;
    }
  }
}

export type CreateNotificationUseCaseInput = {tenantId: number; NotificationCreationAttributes: any};
interface tenantResponse{
  liteResponse :{
    contact
  }
}

export type CreateNotificationUseCaseOutput = {};
