import CreateNotificationUseCase, { CreateNotificationUseCaseInput } from '../usecases/createNotification';
import BaseController from '../utils/abstractions/baseController';
import IHttpRequest from '../utils/abstractions/httpRequest';
import { Logger } from 'logging';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export default class CreateNotificationController extends BaseController {
  constructor(private createNotification?: CreateNotificationUseCase, private logger?: Logger) {
    super();
    this.logger.setName('CreateNotificationController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: CreateNotificationUseCaseInput = {
      NotificationCreationAttributes: {
        description: httpRequest.body['description'],
        sender: httpRequest.body['sender'],
        reciever: httpRequest.body['reciever'],
        isSent: httpRequest.body['isSent'],
        sendingType: httpRequest.body['sendingType'],
        actionType: httpRequest.body['actionType'],
      },
      tenantId: httpRequest.body['tenantId'],
    };
    await this.createNotification.execute(requestModel, this);
  }
}
