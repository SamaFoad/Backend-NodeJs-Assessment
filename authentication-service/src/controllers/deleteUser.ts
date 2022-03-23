import BaseController from '../utils/abstractions/baseController'
import IHttpRequest from '../utils/abstractions/httpRequest';
import { autoInjectable } from 'tsyringe';
import FetchUserUseCase, { FetchUserUseCaseInput } from '../usecases/getUser';
import { Logger } from 'logging';

@autoInjectable()
export default class DeleteUserController extends BaseController {
  constructor(private fetchUser?: FetchUserUseCase, private logger?: Logger) {
    super();
    this.logger.setName('DeleteUserController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: FetchUserUseCaseInput = {
      id: httpRequest.pathParams['id'],
    };
    await this.fetchUser.execute(requestModel, this);
  }

}