import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import PaginateableUseCase, { PaginateableUseCaseInput, PaginateableUseCaseOutput } from '../utils/abstractions/paginateableUseCase';
import OrmException from '../exceptions/OrmException';
import { UrlMonitorAttributes, UrlMonitorInstance } from '../infrastructure/models/url-monitor-model';
import UrlMonitorRepository from '../infrastructure/repositories/URLMonitorRepository';
import { checkUserExsitence } from '../helpers/checkUserExistence';
import { UserCreationAttributes } from '../../../authentication-service/src/infrastructure/models/user-model';

@injectable()
export default class FetchUrlsMonitorUseCase extends PaginateableUseCase<FetchUrlMonitorsUseCaseInput, FetchUrlMonitorsUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private urlMonitorRepository: UrlMonitorRepository) {
    super();
    logger.setName('FetchUrlMonitorsUseCase');
  }
  async execute(params: FetchUrlMonitorsUseCaseInput, presenter: IPresenter<FetchUrlMonitorsUseCaseOutput>): Promise<void> {
    await super.execute(params, presenter);
  }
  async run(params: FetchUrlMonitorsUseCaseInput, presenter: IPresenter<FetchUrlMonitorsUseCaseOutput>): Promise<void> {
    try {
      const user:UserCreationAttributes = await checkUserExsitence(params.token);
      if(user){
        const data: { rows: UrlMonitorInstance[]; count: number } = await this.urlMonitorRepository.getAllByPage(
          params.page,
          params.limit,
          params.sortBy,
        );
        presenter.show({
          data: data.rows,
          paging: {
            currentPage: params.page,
            currentPageLimit: params.limit,
            totalCount: data.count,
          },
        });
      }else{
        presenter.showOauthStateParseError();
      }
    } catch (error) {
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      throw error;
    }
  }
}

export interface FetchUrlMonitorsUseCaseInput extends PaginateableUseCaseInput {
  token: string;
  sortBy: string;
}

export interface FetchUrlMonitorsUseCaseOutput extends PaginateableUseCaseOutput {
  data: UrlMonitorAttributes[];
}
