import { signUpRouter } from '../routes/signup';
import { CustomError, ErrorPayload } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode: number = 400;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeErrors(): ErrorPayload[] {
    return [{ message: this.message }];
    // throw new Error('Method not implemented.');
  }
}
