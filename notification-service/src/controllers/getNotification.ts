import BaseController from '../utils/abstractions/baseController'
import IHttpRequest from '../utils/abstractions/httpRequest';
import { autoInjectable } from 'tsyringe';
import FetchNotificationUseCase, { FetchNotificationUseCaseInput } from '../usecases/getNotification';
import { Logger } from 'logging';

@autoInjectable()
export default class GetNotificationController extends BaseController {
  constructor(private fetchNotification?: FetchNotificationUseCase, private logger?: Logger) {
    super();
    this.logger.setName('GetNotificationController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: FetchNotificationUseCaseInput = {
      id: httpRequest.pathParams['id'],
    };
    await this.fetchNotification.execute(requestModel, this);
  }

}