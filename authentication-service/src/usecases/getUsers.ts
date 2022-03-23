import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import PaginateableUseCase, { PaginateableUseCaseInput, PaginateableUseCaseOutput } from '../utils/abstractions/paginateableUseCase';
import OrmException from '../exceptions/OrmException';
import { UserAttributes, UserInstance } from '../infrastructure/models/user-model';
import UserRepository from '../infrastructure/repositories/UserRepository';

@injectable()
export default class FetchUsersUseCase extends PaginateableUseCase<FetchUsersUseCaseInput, FetchUsersUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private userRepository: UserRepository) {
    super();
    logger.setName('FetchUsersUseCase');
  }
  async execute(params: FetchUsersUseCaseInput, presenter: IPresenter<FetchUsersUseCaseOutput>): Promise<void> {
    await super.execute(params, presenter);
  }
  async run(params: FetchUsersUseCaseInput, presenter: IPresenter<FetchUsersUseCaseOutput>): Promise<void> {
    try {
      const data: { rows: UserInstance[]; count: number } = await this.userRepository.getAllByPage(
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
    } catch (error) {
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      throw error;
    }
  }
}

export interface FetchUsersUseCaseInput extends PaginateableUseCaseInput {
  sortBy: string;
}

export interface FetchUsersUseCaseOutput extends PaginateableUseCaseOutput {
  data: UserAttributes[];
}
