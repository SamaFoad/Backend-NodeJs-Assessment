import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import BaseUseCase from '../utils/abstractions/baseUseCase';
import UrlMonitorRepository from '../infrastructure/repositories/URLMonitorRepository';
import OrmException from '../exceptions/OrmException';
import { checkUserExsitence } from '../helpers/checkUserExistence';
import { UserCreationAttributes } from '../../../authentication-service/src/infrastructure/models/user-model';
import RedisClient from 'redis-client';

@injectable()
export default class FetchReportUseCase extends BaseUseCase<FetchUrlMonitorUseCaseInput, FetchUrlMonitorUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private urlMonitorRepository: UrlMonitorRepository) {
    super();
    logger.setName('FetchUrlMonitorUseCase');
  }
  async execute(params: FetchUrlMonitorUseCaseInput, presenter: IPresenter<FetchUrlMonitorUseCaseOutput>): Promise<void> {
    await this.run(params, presenter);
  }
  async run(params: FetchUrlMonitorUseCaseInput, presenter: IPresenter<FetchUrlMonitorUseCaseOutput>): Promise<void> {
    try {
        console.log("usecaseeeeeeee")
      const user:UserCreationAttributes = await checkUserExsitence(params.token);
      if(user){
          console.log(user);
        const urlMonitors = await this.urlMonitorRepository.fetchMonitorByUserId(user.id);
        if (urlMonitors == null) {
          return presenter.showNotFoundError();
        }
        let description: string[] = []
        urlMonitors.map((urlMonitor) => {
            description.push(`Availability percentage is ${(urlMonitor.numberOfUps/(urlMonitor.numberOfDowns+urlMonitor.numberOfUps))*100}\n
            history: ${urlMonitor.updatedAt} \n status: ${urlMonitor.status} \n outages equal ${urlMonitor.numberOfDowns} \n
            downtime`);
        });
        const queueProvider = new RedisClient();
            queueProvider
            .addToStream(
                process.env.NOTIFICATION_STREAM,
                'sender',
                process.env.NOTIFICATION_EMAIL,
                'reciever',
                user.email,
                'actionType',
                'Report of Url-Monitoring',
                'description',
                description.toString(),
            )
            .catch(error => {
                this.logger.error('Error occurred when adding in redis',error);
            });
        return presenter.show({ success: true, urlMonitor: urlMonitors });
      }else{
        return presenter.showOauthStateParseError();
      }
    } catch (error) {
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      throw error;
    }
  }
}

export interface FetchUrlMonitorUseCaseInput {
  token: string;
}

export type FetchUrlMonitorUseCaseOutput = {};
