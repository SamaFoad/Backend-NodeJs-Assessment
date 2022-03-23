import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import PaginateableUseCase, { PaginateableUseCaseInput, PaginateableUseCaseOutput } from '../utils/abstractions/paginateableUseCase';
import OrmException from '../exceptions/OrmException';
import { NotificationAttributes, NotificationInstance } from '../infrastructure/models/notification-model';
import NotificationRepository from '../infrastructure/repositories/NotificationRepository';

@injectable()
export default class FetchNotificationsUseCase extends PaginateableUseCase<FetchNotificationsUseCaseInput, FetchNotificationsUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private notificationRepository: NotificationRepository) {
    super();
    logger.setName('FetchNotificationsUseCase');
  }
  async execute(params: FetchNotificationsUseCaseInput, presenter: IPresenter<FetchNotificationsUseCaseOutput>): Promise<void> {
    await super.execute(params, presenter);
  }
  async run(params: FetchNotificationsUseCaseInput, presenter: IPresenter<FetchNotificationsUseCaseOutput>): Promise<void> {
    try {
      const data: { rows: NotificationInstance[]; count: number } = await this.notificationRepository.getAllByPage(
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

export interface FetchNotificationsUseCaseInput extends PaginateableUseCaseInput {
  sortBy: string;
}

export interface FetchNotificationsUseCaseOutput extends PaginateableUseCaseOutput {
  data: NotificationAttributes[];
}
