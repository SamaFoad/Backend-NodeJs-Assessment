import CreateUserUseCase, { CreateUserUseCaseInput } from '../usecases/registerUser';
import BaseController from '../utils/abstractions/baseController';
import IHttpRequest from '../utils/abstractions/httpRequest';
import { Logger } from 'logging';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
export default class RegisterUserController extends BaseController {
  constructor(private createUser?: CreateUserUseCase, private logger?: Logger) {
    super();
    this.logger.setName('RegisterUserController');
  }

  async execute(httpRequest: IHttpRequest) {
    const requestModel: CreateUserUseCaseInput = {
      UserCreationAttributes: {
        email: httpRequest.body['email'],
        password: httpRequest.body['password'],
        username: httpRequest.body['username'],
        isVerified: httpRequest.body['isVerified'],
        mobileNumber: httpRequest.body['mobileNumber'],
      },
    };
    await this.createUser.execute(requestModel, this);
  }
}
