import CreateUserUseCase, { CreateUserUseCaseInput } from '../usecases/loginUser';
import BaseController from '../utils/abstractions/baseController';
import IHttpRequest from '../utils/abstractions/httpRequest';
import { Logger } from 'logging';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export default class LoginUserController extends BaseController {
  constructor(private createUser?: CreateUserUseCase, private logger?: Logger) {
    super();
    this.logger.setName('RegisterUserController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: CreateUserUseCaseInput = {
      UserCreationAttributes: {
        email: httpRequest.body['email'],
        password: httpRequest.body['password']
      },
    };
    await this.createUser.execute(requestModel, this);
  }
}
