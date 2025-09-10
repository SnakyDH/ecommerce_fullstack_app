import { IPaymentGatewayRepository } from "@domain/transaction/repository/payment-gateway-repository.interface";
import { PaymentCard } from "@domain/transaction/model/credit-card.model";
import { PostCardTokenizedResponseDto } from "../dtos/post-card-tokenized-response.dto";
import { envOptions } from "@config/env.options";
import { PostCardTokenizedRequestDto } from "../dtos/post-card-tokenized-request.dto";
import { OrderTransaction } from "@domain/transaction/model/transaction.model";
import * as crypto from 'crypto';
import { PostCreateTransactionRequestDto } from "../dtos/post-create-transaction-request.dto";
import { TransactionStatus } from "@domain/transaction/enums/transaction-status.enum";
import { PostCreateTransactionResponseDto, WompiTransactionStatus } from "../dtos/post-create-transaction-response.dto";
import { PaymentResult } from "@domain/transaction/model/payment-result.model";
import { WompiStatusMyStatusMapper } from "../mappers/wompi-status-my-status.mapper";
import { GetWompiTransactionResponseDto } from "../dtos/get-wompi-transaction-response.dto";

export class PaymentWompiRepository implements IPaymentGatewayRepository {
  private readonly projectKey = 'SnakyDev';

  async pay(transaction: OrderTransaction, paymentCard: PaymentCard): Promise<PaymentResult> {
    const tokenizedCard = await this.tokenizeCard({
      number: paymentCard.number,
      cvc: paymentCard.cvv,
      exp_month: paymentCard.expirationMonth,
      exp_year: paymentCard.expirationYear,
      card_holder: paymentCard.holderName,
    });
    const signature = `${this.projectKey}-${transaction.id}${transaction.total}COP${envOptions.wompi.privateKey}`;

    const encryptedSignature = crypto
      .createHash('sha256')
      .update(signature)
      .digest('hex');


    const createTransactionRequest: PostCreateTransactionRequestDto = {
      acceptance_token: transaction.acceptanceEndUserPolicy!.token,
      amount_in_cents: transaction.total!,
      currency: 'COP',
      signature: encryptedSignature,
      customer_email: transaction.delivery?.customerEmail!,
      payment_method: {
        type: 'CARD',
        token: tokenizedCard.data.id,
        installments: 1,
      },
      reference: `${this.projectKey}-${transaction.id}`,
      customer_data: {
        full_name: transaction.delivery?.customer!,
      },
      shipping_address: {
        address_line_1: transaction.delivery?.address!,
        city: transaction.delivery?.city!,
        country: transaction.delivery?.country!,
        phone_number: transaction.delivery?.phone!,
        postal_code: transaction.delivery?.postalCode!,
        region: transaction.delivery?.region!,
      },
    };
    const creationResult = await this.createTransaction(createTransactionRequest);
    if (creationResult.data.status !== WompiTransactionStatus.PENDING) {
      return {
        id: creationResult.data.id,
        status: creationResult.data.status as TransactionStatus,
      };
    }
    // * Retries to get the transaction status with a 1 second delay
    let retries = 5;
    let transactionStatus = WompiTransactionStatus.PENDING;
    while (retries > 0 && transactionStatus === WompiTransactionStatus.PENDING) {
      const transactionStatusResponse = await this.getTransaction(
        creationResult.data.id,
      );
      transactionStatus = transactionStatusResponse.data
        .status as WompiTransactionStatus;
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return {
      id: creationResult.data.id,
      status: WompiStatusMyStatusMapper.map(transactionStatus),
    };

  }

  private async getTransaction(transactionId: string): Promise<GetWompiTransactionResponseDto> {

    const response = await fetch(`${envOptions.wompi.baseUrl}/transactions/${transactionId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${envOptions.wompi.privateKey}`,
        },
      }
    );
    return (await response.json()) as GetWompiTransactionResponseDto;


  }



  private async createTransaction(wompiRequest: PostCreateTransactionRequestDto): Promise<PostCreateTransactionResponseDto> {
    const privApiKey = envOptions.wompi.privateKey;

    const response = await fetch(`${envOptions.wompi.baseUrl}/transactions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${privApiKey}`,
        },
        body: JSON.stringify(wompiRequest),
      }
    );
    return (await response.json()) as PostCreateTransactionResponseDto;

  }
  private async tokenizeCard(paymentCard: PostCardTokenizedRequestDto): Promise<PostCardTokenizedResponseDto> {
    const response = await fetch(
      `${envOptions.wompi.baseUrl}/cards/tokenize`,
      {
        method: 'POST',
        body: JSON.stringify(paymentCard),
        headers: {
          Authorization: `Bearer ${envOptions.wompi.publicKey}`,
        }
      }
    );
    return (await response.json()) as PostCardTokenizedResponseDto;
  }
}