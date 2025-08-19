import { ExceptionConstants } from '@domain/common/exceptions/exception.constants';
import { ExceptionCustom } from '@domain/common/exceptions/exception-custom';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';

export class HttpExceptionHandler {
  handle(exception: ExceptionCustom): never {
    if (exception.message === ExceptionConstants.PRODUCT_NOT_FOUND.toString()) {
      throw new NotFoundException(exception.message);
    }

    throw new InternalServerErrorException(exception.message);
  }
}
