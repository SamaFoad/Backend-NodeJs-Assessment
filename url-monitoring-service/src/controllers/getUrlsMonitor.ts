import BaseController from '../utils/abstractions/baseController';
import IHttpRequest from '../utils/abstractions/httpRequest';
import { autoInjectable } from 'tsyringe';
import FetchUrlMonitorsUseCase, { FetchUrlMonitorsUseCaseInput } from '../usecases/getUrlsMonitor';
import { Logger } from 'logging';

@autoInjectable()
export default class GetUrlMonitorController extends BaseController {
  constructor(private fetchUrlMonitors?: FetchUrlMonitorsUseCase, private logger?: Logger) {
    super();
    this.logger.setName('GetUrlMonitorController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: FetchUrlMonitorsUseCaseInput = {
      limit: httpRequest.queryParams['limit'],
      page: httpRequest.queryParams['page'],
      token: httpRequest.headers['authorization']?.split(' ')[1],
      sortBy: httpRequest.queryParams['sort_by'] || 'id',
    };
    await this.fetchUrlMonitors.execute(requestModel, this);
  }
}
