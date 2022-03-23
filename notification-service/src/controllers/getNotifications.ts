import BaseController from '../utils/abstractions/baseController';
import IHttpRequest from '../utils/abstractions/httpRequest';
import { autoInjectable } from 'tsyringe';
import FetchNotificationsUseCase, { FetchNotificationsUseCaseInput } from '../usecases/getNotifications';
import { Logger } from 'logging';

@autoInjectable()
export default class GetNotificationController extends BaseController {
  constructor(private fetchNotifications?: FetchNotificationsUseCase, private logger?: Logger) {
    super();
    this.logger.setName('GetNotificationController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: FetchNotificationsUseCaseInput = {
      limit: httpRequest.queryParams['limit'],
      page: httpRequest.queryParams['page'],
      // filters: {
      //   action: httpRequest.queryParams['action'],
      //   description: httpRequest.queryParams['description'],
      //   resourceName: httpRequest.queryParams['resource_name'],
      //   userId: httpRequest.queryParams['user_id'],
      // },
      sortBy: httpRequest.queryParams['sort_by'] || 'id',
    };
    await this.fetchNotifications.execute(requestModel, this);
  }
}
