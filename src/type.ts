export interface Recipient {
  userId: string;
  displayName: string;
  paymentReference: string;
  accountNumber: string;
}

export interface TransferDetails {
  accountNumber?: string;
  accountId?: string;
  accountName?: string;
  amount?: number;
  currencyCode?: string;
  purpose?: string;
  note?: string;
  otherPurpose?: string;
  charge?: PaymentCharge;
  bankName?: string;
  provider?: PaymentProvider;
  transferType?: 'UD' | 'OTHERS';
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

export interface PaymentMethod {
  LocalInstrument: string;
  Name: string;
  Description: string;
  Group: string;
  IsActive: boolean;
  Charges: PaymentCharge[];
  Reason?: string;
}

export interface PaymentCharge {
  Provider: string;
  Fee: number;
  Min: number;
  Max: number;
}

export interface EBank {
  id: string;
  name: string;
  createdAt: string;
  paymentProviders: PaymentProvider[];
}

export interface PaymentProvider {
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  isDefault: boolean;
}

export type GroupEBank = {
  section: string;
  items: EBank[];
};

export type GroupContacts = {
  section: string;
  items: Recipient[];
};

export type Wallet = {
  walletId: string;
  walletName: string;
  currentBalance: number;
  availableBalance: number;
  currencyCode: string;
  isDefaultWallet: boolean;
  bankAccount: {
    bankCode: string;
    accountNumber: string;
    accountId: string;
  };
};
export interface PhoneNumber {
  label: string;
  number: string;
}

export interface DeviceContact {
  recordID: string;
  backTitle: string;
  company: string | null;
  displayName: string;
  familyName: string;
  givenName: string;
  middleName: string;
  jobTitle: string;
  phoneNumbers: PhoneNumber[];
  hasThumbnail: boolean;
  thumbnailPath: string;
  prefix: string;
  suffix: string;
  department: string;
  note: string;
  fullName: string;
}

export type GroupDeviceContact = {
  section: string;
  items: DeviceContact[];
};
