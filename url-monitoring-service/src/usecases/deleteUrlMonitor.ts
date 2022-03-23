import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import BaseUseCase from '../utils/abstractions/baseUseCase';
import UrlMonitorRepository from '../infrastructure/repositories/URLMonitorRepository';
import OrmException from '../exceptions/OrmException';
import { ErrorLog } from '../common/constants/logMessages';
import ServiceUnreachableException from '../exceptions/ServiceUnreachableException';
import { checkUserExsitence } from '../helpers/checkUserExistence';
import { UserCreationAttributes } from '../../../authentication-service/src/infrastructure/models/user-model';

@injectable()
export default class DeleteUrlMonitorUseCase extends BaseUseCase<DeleteUrlMonitorUseCaseInput, DeleteUrlMonitorUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private urlMonitorRepository: UrlMonitorRepository) {
    super();
    this.logger.setName('DeleteUrlMonitorUseCase');
  }
  async execute(params: DeleteUrlMonitorUseCaseInput, presenter: IPresenter<DeleteUrlMonitorUseCaseOutput>): Promise<void> {
    if (!params.id) return presenter.showMissingArgumentError('id');
    this.logger.info(`Deleting UrlMonitor with id ${params.id}`);
    await this.run(params, presenter);
  }
  async run(params: DeleteUrlMonitorUseCaseInput, presenter: IPresenter<DeleteUrlMonitorUseCaseOutput>): Promise<void> {
    try {
      const user:UserCreationAttributes = await checkUserExsitence(params.token);
      if(user){
        await this.urlMonitorRepository.deleteUrlMonitor(parseInt(params.id));
        presenter.show({
          success: true,
        });
      }else{
        presenter.showOauthStateParseError();
      }
    } catch (error) {
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      if (error instanceof ServiceUnreachableException) return presenter.showServiceUnreachableError(error.serviceName);

      throw error;
    }
  }
}

export type DeleteUrlMonitorUseCaseInput = { token: string; id: string };

export type DeleteUrlMonitorUseCaseOutput = {};
