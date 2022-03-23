import { UserCreationAttributes } from './../../../authentication-service/src/infrastructure/models/user-model';
import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import BaseUseCase from '../utils/abstractions/baseUseCase';
import UrlMonitorRepository from '../infrastructure/repositories/URLMonitorRepository';
import OrmException from '../exceptions/OrmException';
import ServiceUnreachableException from '../exceptions/ServiceUnreachableException';
import { ErrorLog } from '../common/constants/logMessages';
import { checkUserExsitence } from '../helpers/checkUserExistence';
import { UrlMonitorCreationAttributes } from '../infrastructure/models/url-monitor-model';
import RedisClient from 'redis-client';

@injectable()
export default class UpdateUrlMonitorUseCase extends BaseUseCase<UpdateUrlMonitorUseCaseInput, UpdateUrlMonitorUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private urlMonitorRepository: UrlMonitorRepository) {
    super();
    this.logger.setName('UpdateUrlMonitorUseCase');
  }
  async execute(params: UpdateUrlMonitorUseCaseInput, presenter: IPresenter<UpdateUrlMonitorUseCaseOutput>): Promise<void> {
    await this.run(params, presenter);
  }
  async run(params: UpdateUrlMonitorUseCaseInput, presenter: IPresenter<UpdateUrlMonitorUseCaseOutput>): Promise<void> {
    try {
        let isNewUrl: boolean = false;
        const user : UserCreationAttributes= await checkUserExsitence(params.token);
        if(user){
          params.UrlMonitorCreationAttributes.userId = user.id;
          //check existence of url in db
          let urlMonitor:UrlMonitorCreationAttributes;
          let urlMonitorBeforeUpdate:UrlMonitorCreationAttributes = await this.urlMonitorRepository.fetchMonitorByURL(params.UrlMonitorCreationAttributes.url);
          if(urlMonitorBeforeUpdate == null){
            urlMonitor = await this.urlMonitorRepository.createUrlMonitor(params.UrlMonitorCreationAttributes);
            isNewUrl = true;
          }

          try {
            const responseUrl = await this.httpClient.get(params.UrlMonitorCreationAttributes.url) 
            if(responseUrl.status < 400){
              params.UrlMonitorCreationAttributes.status = 'UP';
              params.UrlMonitorCreationAttributes.numberOfUps = urlMonitorBeforeUpdate ? urlMonitorBeforeUpdate.numberOfUps + 1 : urlMonitor.numberOfUps + 1;
            }
            // console.debug(responseUrl); 
          } catch (error) {
            console.debug("Error Occurred while fetching url provided", error)
              params.UrlMonitorCreationAttributes.status = 'DOWN';
              params.UrlMonitorCreationAttributes.numberOfDowns = urlMonitorBeforeUpdate ? urlMonitorBeforeUpdate.numberOfDowns + 1 : urlMonitor.numberOfDowns + 1;
          }

          //Adding to redis to send email
          if(isNewUrl || (!isNewUrl && (urlMonitorBeforeUpdate.status != params.UrlMonitorCreationAttributes.status))){
            const queueProvider = new RedisClient();
            queueProvider
            .addToStream(
              process.env.NOTIFICATION_STREAM,
              'sender',
              process.env.NOTIFICATION_EMAIL,
              'reciever',
              user.email,
              'actionType',
              'Update on status of Url-Monitoring',
              'description',
              `${isNewUrl ? urlMonitor?.url : urlMonitorBeforeUpdate?.url} current status is ${params.UrlMonitorCreationAttributes.status}`,
            )
            .catch(error => {
              this.logger.error('Error occurred when adding in redis',error);
            });
          }

          urlMonitor = await this.urlMonitorRepository.updateUrlMonitor(params.UrlMonitorCreationAttributes);
          return presenter.show(urlMonitor);
        }else{
            return presenter.showOauthStateParseError();
        }
    } catch (error) {
      console.debug(error);
    //   this.logger.error(ErrorLog.UPDATE_DATA.replace('%s', 'UrlMonitor'), error);
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      if (error instanceof ServiceUnreachableException) return presenter.showServiceUnreachableError(error.serviceName);
      throw error;
    }
  }
  
}

export type UpdateUrlMonitorUseCaseInput = {
  token: string; 
  UrlMonitorCreationAttributes: {
    userId?: number,
    name: string,
    url: string,
    numberOfUps?: number,
    numberOfDowns?: number,
    status?: 'UP' | 'DOWN',
  } 
};

export type UpdateUrlMonitorUseCaseOutput = {};
