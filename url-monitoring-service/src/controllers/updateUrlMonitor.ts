import BaseController from '../utils/abstractions/baseController';
import IHttpRequest from '../utils/abstractions/httpRequest';
import { autoInjectable } from 'tsyringe';
import UpdateUrlMonitorUseCase, { UpdateUrlMonitorUseCaseInput } from '../usecases/updateUrlMonitor';
import { Logger } from 'logging';

@autoInjectable()
export default class UpdateUrlMonitorController extends BaseController {
  constructor(private updateUrlMonitor?: UpdateUrlMonitorUseCase, private logger?: Logger) {
    super();
    this.logger.setName('updateUrlMonitorController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: UpdateUrlMonitorUseCaseInput = {
      token: httpRequest.headers['authorization']?.split(' ')[1],
      UrlMonitorCreationAttributes: {
        url: httpRequest.body['url'],
        name: httpRequest.body['name'],
      },
    };
    await this.updateUrlMonitor.execute(requestModel, this);
  }
}
