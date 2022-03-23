import BaseController from '../utils/abstractions/baseController'
import IHttpRequest from '../utils/abstractions/httpRequest';
import { autoInjectable } from 'tsyringe';
import FetchUrlMonitorUseCase, { FetchUrlMonitorUseCaseInput } from '../usecases/getUrlMonitor';
import { Logger } from 'logging';

@autoInjectable()
export default class GetUrlMonitorController extends BaseController {
  constructor(private fetchUrlMonitor?: FetchUrlMonitorUseCase, private logger?: Logger) {
    super();
    this.logger.setName('GetUrlMonitorController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: FetchUrlMonitorUseCaseInput = {
      id: httpRequest.pathParams['id'],
      token: httpRequest.headers['authorization']?.split(' ')[1],
    };
    await this.fetchUrlMonitor.execute(requestModel, this);
  }

}