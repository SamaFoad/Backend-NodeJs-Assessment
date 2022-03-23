import DeleteUrlMonitorUseCase, { DeleteUrlMonitorUseCaseInput } from '../usecases/deleteUrlMonitor';
import BaseController from '../utils/abstractions/baseController';
import IHttpRequest from '../utils/abstractions/httpRequest';
import { Logger } from 'logging';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export default class DeleteUrlMonitorController extends BaseController {
  constructor(private deleteUrlMonitor?: DeleteUrlMonitorUseCase, private logger?: Logger) {
    super();
    this.logger.setName('DeleteUrlMonitorController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: DeleteUrlMonitorUseCaseInput = {
      id: httpRequest.pathParams['id'],
      token: httpRequest.headers['authorization']?.split(' ')[1],
    };
    await this.deleteUrlMonitor.execute(requestModel, this);
  }
}
