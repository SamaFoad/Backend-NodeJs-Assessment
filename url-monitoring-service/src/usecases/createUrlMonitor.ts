import { UserCreationAttributes } from './../../../authentication-service/src/infrastructure/models/user-model';
import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import BaseUseCase from '../utils/abstractions/baseUseCase';
import UrlMonitorRepository from '../infrastructure/repositories/URLMonitorRepository';
import { UrlMonitorCreationAttributes } from '../infrastructure/models/url-monitor-model';
import OrmException from '../exceptions/OrmException';
import { getDateNow } from '../common/util';
import { checkUserExsitence } from '../helpers/checkUserExistence';

@injectable()
export default class CreateUrlMonitorUseCase extends BaseUseCase<CreateUrlMonitorUseCaseInput, CreateUrlMonitorUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private urlMonitorRepository: UrlMonitorRepository) {
    super();
    this.logger.setName('CreateUrlMonitorUseCase');
  }
  async execute(params: CreateUrlMonitorUseCaseInput, presenter: IPresenter<CreateUrlMonitorUseCaseOutput>): Promise<void> {
    if(!params.UrlMonitorCreationAttributes.url) return presenter.showMissingArgumentError("url");
    await this.run(params, presenter);
  }
  async run(params: CreateUrlMonitorUseCaseInput, presenter: IPresenter<CreateUrlMonitorUseCaseOutput>): Promise<void> {
    try {
      const user:UserCreationAttributes = await checkUserExsitence(params.token);
      if(user){
        params.UrlMonitorCreationAttributes.userId = user.id;
        let urlMonitor:UrlMonitorCreationAttributes;
        //check existence of url in db
        urlMonitor = await this.urlMonitorRepository.fetchMonitorByURL(params.UrlMonitorCreationAttributes.url);
        if(urlMonitor != null){
          return presenter.showInvalidArgumentError("url", "to be unique");
        }else{
          urlMonitor = await this.urlMonitorRepository.createUrlMonitor(params.UrlMonitorCreationAttributes);
          return presenter.show(urlMonitor);
        }
      }else{
        presenter.showOauthStateParseError();
      }
    } catch (error) {
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      throw error;
    }
  }
}

export type CreateUrlMonitorUseCaseInput = {
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

export type CreateUrlMonitorUseCaseOutput = {};
