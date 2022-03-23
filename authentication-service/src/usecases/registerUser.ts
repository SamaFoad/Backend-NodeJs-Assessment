import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import BaseUseCase from '../utils/abstractions/baseUseCase';
import UserRepository from '../infrastructure/repositories/UserRepository';
import { UserCreationAttributes } from '../infrastructure/models/user-model';
import OrmException from '../exceptions/OrmException';
import crypto from 'crypto';

@injectable()
export default class CreateUserUseCase extends BaseUseCase<CreateUserUseCaseInput, CreateUserUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private userRepository: UserRepository) {
    super();
    this.logger.setName('CreateUserUseCase');
  }
  async execute(params: CreateUserUseCaseInput, presenter: IPresenter<CreateUserUseCaseOutput>): Promise<void> {
    if(!params.UserCreationAttributes.email) return presenter.showMissingArgumentError('email');
    if(!params.UserCreationAttributes.password) presenter.showMissingArgumentError("password");
    await this.run(params, presenter);
  }
  async run(params: CreateUserUseCaseInput, presenter: IPresenter<CreateUserUseCaseOutput>): Promise<void> {
    try {
      let user:UserCreationAttributes;
      //verify email by creating notifcation to send email
      let verficationEmail =  await this.httpClient.post<NotificationEmailResponse>({
        url: `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
        body: await this.parseNotificationEmail(params.UserCreationAttributes),
      });

      // check email sent status
      if(verficationEmail?.data?.liteResponse.isSent === true){
        // create user
        params.UserCreationAttributes.isVerified = true;
        params.UserCreationAttributes.password = crypto.createHash('md5').update(process.env.HASH_SECRET).digest('hex');
        user = await this.userRepository.createUser(params.UserCreationAttributes);
      }else{
        presenter.showInvalidArgumentError('email', 'valid email');
      }
      
      presenter.show(user);
    } catch (error) {
      if(error.message === 'Validation error') return presenter.showInvalidArgumentError('email, username, mobileNumber', 'to be unique');
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      return presenter.showNotSupportedError('Not Supported Error');
    }
  }

  async parseNotificationEmail(message: any): Promise<any> {
    return {
      isSent: false,
      actionType: "Verification Email",
      sendingType : "automated",
      description: "Your email now is verified successfully, no action required from your side" ,
      reciever: message.email
    };
  }
}

export type CreateUserUseCaseInput = {UserCreationAttributes: any};
interface NotificationEmailResponse{
  liteResponse :{
    isSent
  }
}

export type CreateUserUseCaseOutput = {};
