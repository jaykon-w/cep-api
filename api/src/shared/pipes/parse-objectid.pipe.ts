import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { isValidObjectId } from 'mongoose';
import { BusinessError, ERRORS } from '../errors/business.error';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const isValid = isValidObjectId(value);
    if (!isValid)
      throw new BusinessError(ERRORS.BAD_REQUEST, 'Invalid id format');

    return new ObjectId(value);
  }
}
