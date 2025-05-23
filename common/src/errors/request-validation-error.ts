import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Some/All of the request parameters are invalid');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    const formattedErrors = this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: String(err.msg), field: err.path };
      }
      return { message: err.msg };
    });
    return formattedErrors;
  }
}
