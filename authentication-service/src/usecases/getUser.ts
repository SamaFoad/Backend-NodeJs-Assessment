import { injectable } from 'tsyringe';
import { Logger } from 'logging';
import HttpClient from 'http-client';
import IPresenter from '../utils/abstractions/presenter';
import BaseUseCase from '../utils/abstractions/baseUseCase';
import UserRepository from '../infrastructure/repositories/UserRepository';
import OrmException from '../exceptions/OrmException';

@injectable()
export default class FetchUserUseCase extends BaseUseCase<FetchUserUseCaseInput, FetchUserUseCaseOutput> {
  constructor(private logger: Logger, private httpClient: HttpClient, private userRepository: UserRepository) {
    super();
    logger.setName('FetchUserUseCase');
  }
  async execute(params: FetchUserUseCaseInput, presenter: IPresenter<FetchUserUseCaseOutput>): Promise<void> {
    if (!params.id) return presenter.showMissingArgumentError('id');
    await this.run(params, presenter);
  }
  async run(params: FetchUserUseCaseInput, presenter: IPresenter<FetchUserUseCaseOutput>): Promise<void> {
    try {
      const user = await this.userRepository.fetchUserById(parseInt(params.id));
      if (user == null) {
        presenter.showNotFoundError();
        return;
      }else{
        presenter.show(user);
      }
    } catch (error) {
      if (error instanceof OrmException) return presenter.showDatabaseError(error.message, error.resourceName);
      throw error;
    }
  }
}

export interface FetchUserUseCaseInput {
  id: string;
}

export type FetchUserUseCaseOutput = {};
