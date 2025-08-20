import { PresignedController } from '@adapter/in/controllers/presigned.controller';
import { GetPresignedHandler } from '@adapter/in/handlers/get-presigned-handler';
import { HttpExceptionHandler } from '@adapter/in/handlers/http-exception.handler';
import { GetPresignedUseCase } from '@domain/presigned/use_case/get-presigned.use-case';
import { Module } from '@nestjs/common';
import { PresignedWompiService } from 'src/adapter/out/wompi/repository/presigned-wompi.repository';

@Module({
  imports: [],
  controllers: [PresignedController],
  providers: [
    {
      provide: 'IPresignedRepository',
      useClass: PresignedWompiService,
    },
    {
      provide: GetPresignedUseCase,
      useFactory: (presignedRepository: PresignedWompiService) =>
        new GetPresignedUseCase(presignedRepository),
      inject: ['IPresignedRepository'],
    },
    {
      provide: GetPresignedHandler,
      useFactory: (getPresignedUseCase: GetPresignedUseCase) =>
        new GetPresignedHandler(getPresignedUseCase),
      inject: [GetPresignedUseCase],
    },
    HttpExceptionHandler,
  ],
  exports: [GetPresignedHandler],
})
export class PresignedModule { }
