export interface Recipient {
  userId: string;
  serviceCode: string;
  subServiceCode: string;
  displayName: string;
  paymentReference: string;
  accountNumber: string;
  bankCode: string;
}

export interface TransferDetails {
  accountNumber: string;
  accountId: string;
  accountName: string;
  amount: number;
  purpose?: string;
  note?: string;
  currencyCode: string;
}

export interface TransferResponse {
  transferId: string;
  status: string;
  transactionDate: string;
  referenceNo?: string;
}

export enum TransferStatus {
  progressing = 'progressing',
  success = 'success',
  failed = 'failed',
}
