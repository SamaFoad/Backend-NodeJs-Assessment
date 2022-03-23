import BaseController from '../utils/abstractions/baseController'
import IHttpRequest from '../utils/abstractions/httpRequest';
import { autoInjectable } from 'tsyringe';
import FetchUrlMonitorUseCase, { FetchUrlMonitorUseCaseInput } from '../usecases/getReport';
import { Logger } from 'logging';

@autoInjectable()
export default class GetReportController extends BaseController {
  constructor(private fetchUrlMonitor?: FetchUrlMonitorUseCase, private logger?: Logger) {
    super();
    this.logger.setName('GetReportController');
  }

  async execute(httpRequest: IHttpRequest) {
    console.log("hereeeeeeeeeeeeee");
    const requestModel: FetchUrlMonitorUseCaseInput = {
      token: httpRequest.headers['authorization']?.split(' ')[1],
    };
    await this.fetchUrlMonitor.execute(requestModel, this);
  }

}