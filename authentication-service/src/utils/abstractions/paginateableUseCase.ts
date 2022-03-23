import IPresenter from './presenter';
import BaseUseCase from './baseUseCase';

export default abstract class PaginateableUseCase<
  T extends PaginateableUseCaseInput = PaginateableUseCaseInput,
  U extends PaginateableUseCaseOutput = PaginateableUseCaseOutput
> extends BaseUseCase<T, U> {
  constructor(protected supportsCursorPagination = true, protected supportsTimePagination = true, protected supportsOffsetPagination = true) {
    super();
  }

  async execute(params: T, presenter: IPresenter<U>): Promise<void> {
    if (!this.supportsCursorPagination && this.hasCursorParams(params)) return presenter.showPaginationNotSupportedError('Cursor');

    if (!this.supportsOffsetPagination && this.hasOffsetParams(params)) return presenter.showPaginationNotSupportedError('Offset');

    if (!this.supportsTimePagination && this.hasTimeParams(params)) return presenter.showPaginationNotSupportedError('Time');

    if (params.limit && params.limit > 1000) return presenter.showInvalidArgumentError('limit', 'Less than 1000');

    if (!params.limit) params.limit = 10;

    await this.run(params, presenter);
  }

  abstract run(params: T, presenter: IPresenter<U>): Promise<void>;

  protected hasCursorParams(params: T) {
    return params.afterCursor || params.beforeCursor;
  }

  protected hasOffsetParams(params: T) {
    return params.offset;
  }

  protected hasTimeParams(params: T) {
    return params.since || params.until;
  }
}

export interface PaginateableUseCaseInput {
  afterCursor?: string;
  beforeCursor?: string;
  since?: Date;
  until?: Date;
  offset?: number;
  limit?: number;
  page?: number;
}

export interface PaginateableUseCaseOutput {
  data: any[];
  paging: {
    totalCount?: number;
    currentPage?:number;
    currentPageLimit?:number;
  };
}
