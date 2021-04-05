import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';
import { BusinessError, ERRORS } from '../errors/business.error';

const MONGO_UNIQUE_CONSTRAINT_ERROR_CODE = 11000;

@Catch(MongoError)
export class MongoErrorFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { code, message } = exception;

    try {
      const [_, items] = message.match(/\{\s?(\w+):.*?\}/) as RegExpMatchArray;

      if (code === MONGO_UNIQUE_CONSTRAINT_ERROR_CODE) {
        const error = new BusinessError(ERRORS.DUPLICATED_IDENTIFIER, items);
        response.status(error.httpCode).json(error.toJSON());
        return;
      }
    } catch (err) {
      Logger.error(message);
    }

    const error = new BusinessError(ERRORS.INTERNAL_SERVER_ERROR);
    response.status(error.httpCode).json(error.toJSON());
    return;
  }
}
