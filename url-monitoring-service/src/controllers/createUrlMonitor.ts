import CreateUrlMonitorUseCase, { CreateUrlMonitorUseCaseInput } from '../usecases/createUrlMonitor';
import BaseController from '../utils/abstractions/baseController';
import IHttpRequest from '../utils/abstractions/httpRequest';
import { Logger } from 'logging';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export default class CreateUrlMonitorController extends BaseController {
  constructor(private createUrlMonitor?: CreateUrlMonitorUseCase, private logger?: Logger) {
    super();
    this.logger.setName('CreateUrlMonitorController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: CreateUrlMonitorUseCaseInput = {
      UrlMonitorCreationAttributes: {
        url: httpRequest.body['url'],
        name: httpRequest.body['name'],
      },
      token: httpRequest.headers['authorization']?.split(' ')[1],
    };
    await this.createUrlMonitor.execute(requestModel, this);
  }
}
