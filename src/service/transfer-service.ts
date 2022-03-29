type TransferClient = {
  paymentClient: any;
  contactClient: any;
};

export class TransferService {
  private static _instance: TransferService = new TransferService();

  private _paymentClient?: any;
  private _contactClient?: any;

  constructor() {
    if (TransferService._instance) {
      throw new Error(
        'Error: Instantiation failed: Use TransferService.getInstance() instead of new.'
      );
    }
    TransferService._instance = this;
  }

  public static instance(): TransferService {
    return TransferService._instance;
  }

  public initClients = (clients: TransferClient) => {
    this._paymentClient = clients.paymentClient;
    this._contactClient = clients.contactClient;
  };

  public searchBeneficary = async (mobileNumber?: string, accountNumber?: string) => {
    if (this._contactClient) {
      const response = await this._contactClient.get('beneficiaries', {
        params: {
          mobileNumber,
          accountNumber,
        },
      });
      return response.data;
    } else {
      throw new Error('Transfer Client is not registered');
    }
  };

  public getRecentContacts = async () => {
    if (this._contactClient) {
      const response = await this._contactClient.get('contacts');
      return response.data;
    } else {
      throw new Error('Transfer Client is not registered');
    }
  };

  public addContact = async (accountId: string, accountNumber: string, displayName: string) => {
    if (this._contactClient) {
      const response = await this._contactClient.post('contacts', {
        accountId,
        accountNumber,
        displayName,
      });
      return response.data;
    } else {
      throw new Error('Transfer Client is not registered');
    }
  };

  public initTransfer = async (
    amount: number,
    currency: string,
    debtor: {
      accountId: string;
      schemeName: string;
    },
    creditor: {
      accountId: string;
      name: string;
      schemeName: string;
    },
    transferPurpose?: string,
    note?: string
  ) => {
    if (this._paymentClient) {
      const response = await this._paymentClient.post('payments', {
        Data: {
          Initiation: {
            LocalInstrument: 'UD',
            InstructedAmount: {
              Amount: amount,
              Currency: currency,
            },
            DebtorAccount: {
              Identification: debtor.accountId,
              SchemeName: debtor.schemeName,
            },
            CreditorAccount: {
              Identification: creditor.accountId,
              SchemeName: creditor.schemeName,
              Name: creditor.name,
            },
            CreditorAccountExt: {},
            RemittanceInformation: {
              Unstructured: note ?? '',
            },
            SupplementaryData: {
              PaymentServiceProviderExt: {
                PspName: 'UD',
              },
              CustomFields: [
                {
                  Key: 'TransferPurpose',
                  Value: transferPurpose ?? '',
                },
              ],
            },
          },
        },
        Risk: {
          PaymentContextCode: 'PartyToParty',
        },
      });
      return response.data;
    } else {
      throw new Error('Transfer Client is not registered');
    }
  };

  public authorizePayment = async (paymentId: string, otp: string) => {
    if (this._paymentClient) {
      const response = await this._paymentClient.patch(`payments/${paymentId}`, {
        Data: {
          Initiation: {
            SupplementaryData: {
              CustomFields: [
                {
                  Key: 'OTP',
                  Value: otp,
                },
              ],
            },
          },
        },
      });
      return response.data;
    } else {
      throw new Error('Transfer Client is not registered');
    }
  };

  public resendOTP = async (paymentId: string) => {
    if (this._paymentClient) {
      const response = await this._paymentClient.patch(`payments/${paymentId}`, {
        Data: {
          Initiation: {
            SupplementaryData: {
              CustomFields: [
                {
                  Key: 'ReSendOTP',
                  Value: 'true',
                },
              ],
            },
          },
        },
      });
      return response.data;
    } else {
      throw new Error('Transfer Client is not registered');
    }
  };
}
