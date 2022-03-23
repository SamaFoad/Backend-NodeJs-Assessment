import BaseController from './abstractions/baseController';
import httpRequest from './abstractions/httpRequest';

export default class NotSupportedController extends BaseController {
  constructor(private thing: string = 'Functionality') {
    super();
  }
  async execute(httpRequest: httpRequest): Promise<void> {
    this.showNotSupportedError(this.thing);
  }
}
