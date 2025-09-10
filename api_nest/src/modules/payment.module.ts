import { Module } from '@nestjs/common';
import { PaymentWompiRepository } from '../adapter/out/wompi/repository/payment-wompi.repository';

@Module({
  providers: [
    {
      provide: 'IPaymentGatewayRepository',
      useClass: PaymentWompiRepository,
    },
  ],
  exports: ['IPaymentGatewayRepository'],
})
export class PaymentModule { }
