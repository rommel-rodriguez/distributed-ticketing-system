import { CustomError, ErrorPayload } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode: number = 401;
  constructor() {
    super('Not Authorized');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): ErrorPayload[] {
    return [{ message: 'Not Authorized' }];
  }
}
