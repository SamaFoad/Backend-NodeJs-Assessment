import IPresenter from './presenter';
// Base Interactor
export default abstract class UseCase<InputModel = any, OutputModel = any> {
  abstract execute(params: InputModel, presenter: IPresenter<OutputModel>): Promise<void>;
}
