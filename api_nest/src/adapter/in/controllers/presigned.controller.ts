import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { Presigned } from 'domain/presigned/model/presigned.model';
import { GetPresignedHandler } from '../handlers/get-presigned-handler';
import { HttpExceptionHandler } from '../handlers/http-exception.handler';
import { ExceptionCustom } from '@domain/common/exceptions/exception-custom';

@Controller('presigned')
export class PresignedController {
  constructor(
    private readonly getPresignedsHandler: GetPresignedHandler,
    private readonly httpExceptionHandler: HttpExceptionHandler,
  ) { }

  @Get()
  async getPresigned(): Promise<Presigned[]> {
    try {
      return await this.getPresignedsHandler.execute();
    } catch (error) {
      if (error instanceof ExceptionCustom) {
        this.httpExceptionHandler.handle(error);
        throw error; // Re-throw to let the exception handler deal with it
      }
      throw new InternalServerErrorException(error);
    }
  }
}
