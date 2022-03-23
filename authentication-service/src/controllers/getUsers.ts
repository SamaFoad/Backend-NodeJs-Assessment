import BaseController from '../utils/abstractions/baseController';
import IHttpRequest from '../utils/abstractions/httpRequest';
import { autoInjectable } from 'tsyringe';
import FetchUsersUseCase, { FetchUsersUseCaseInput } from '../usecases/getUsers';
import { Logger } from 'logging';

@autoInjectable()
export default class GetUsersController extends BaseController {
  constructor(private fetchUsers?: FetchUsersUseCase, private logger?: Logger) {
    super();
    this.logger.setName('GetUsersController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: FetchUsersUseCaseInput = {
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
    await this.fetchUsers.execute(requestModel, this);
  }
}
