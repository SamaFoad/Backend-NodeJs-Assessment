import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import BaseUseCase from '../utils/abstractions/baseUseCase';
import UrlMonitorRepository from '../infrastructure/repositories/URLMonitorRepository';
import OrmException from '../exceptions/OrmException';
import { checkUserExsitence } from '../helpers/checkUserExistence';
import { UserCreationAttributes } from '../../../authentication-service/src/infrastructure/models/user-model';

@injectable()
export default class FetchUrlMonitorUseCase extends BaseUseCase<FetchUrlMonitorUseCaseInput, FetchUrlMonitorUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private urlMonitorRepository: UrlMonitorRepository) {
    super();
    logger.setName('FetchUrlMonitorUseCase');
  }
  async execute(params: FetchUrlMonitorUseCaseInput, presenter: IPresenter<FetchUrlMonitorUseCaseOutput>): Promise<void> {
    if (!params.id) return presenter.showMissingArgumentError('id');
    await this.run(params, presenter);
  }
  async run(params: FetchUrlMonitorUseCaseInput, presenter: IPresenter<FetchUrlMonitorUseCaseOutput>): Promise<void> {
    try {
      const user:UserCreationAttributes = await checkUserExsitence(params.token);
      if(user){
        const urlMonitor = await this.urlMonitorRepository.fetchMonitorById(parseInt(params.id));
        if (urlMonitor == null) {
          presenter.showNotFoundError();
          return;
        }
        presenter.show(urlMonitor);
      }else{
        presenter.showOauthStateParseError();
      }
    } catch (error) {
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      throw error;
    }
  }
}

export interface FetchUrlMonitorUseCaseInput {
  id: string;
  token: string;
}

export type FetchUrlMonitorUseCaseOutput = {};
