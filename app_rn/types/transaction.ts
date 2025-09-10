export interface CreditCard {
  number: string;
  cvv: string;
  expirationMonth: string;
  expirationYear: string;
  holderName: string;
}

export interface Delivery {
  customer: string;
  customerEmail: string;
  address: string;
  country: string;
  region: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface TransactionFormData {
  delivery: Delivery;
  creditCard: CreditCard;
}

export enum CardType {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMEX = 'amex',
  DISCOVER = 'discover',
  UNKNOWN = 'unknown',
}

export interface CardInfo {
  type: CardType;
  icon: string;
}
