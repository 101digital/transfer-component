type TransferClient = {
  paymentClient: any;
  contactClient: any;
  bankInformationClient: any;
  schemes: TransferScheme;
};

type TransferScheme = {
  udScheme: string;
  pesonetScheme: string;
  instapayScheme: string;
};

export class TransferService {
  private static _instance: TransferService = new TransferService();

  private _paymentClient?: any;
  private _contactClient?: any;
  private _bankInformationClient?: any;
  private _schemes?: TransferScheme;

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
    this._bankInformationClient = clients.bankInformationClient;
    this._schemes = clients.schemes;
  };

  public getSchemes = () => this._schemes;

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
      const response = await this._contactClient.get('contacts', {
        params: {
          pageSize: 1000,
        },
      });
      return response.data;
    } else {
      throw new Error('Contact Client is not registered');
    }
  };

  public addContact = async (
    paymentReference: string,
    accountNumber: string,
    displayName: string
  ) => {
    if (this._contactClient) {
      const response = await this._contactClient.post('contacts', {
        paymentReference,
        accountNumber,
        displayName,
      });
      return response.data;
    } else {
      throw new Error('Transfer Client is not registered');
    }
  };

  public initTransfer = async (
    provider: string,
    amount: number,
    currency: string,
    debtor: {
      accountId: string;
      schemeName: string;
    },
    creditor: {
      accountId: string;
      schemeName: string;
      name: string;
    },
    bankCode?: string,
    transferPurpose?: string,
    otherPurpose?: string,
    note?: string
  ) => {
    if (this._paymentClient) {
      const _customFields = [
        {
          Key: 'TransferPurpose',
          Value: transferPurpose,
        },
      ];
      if (otherPurpose) {
        _customFields.push({
          Key: 'TransferNotes',
          Value: otherPurpose,
        });
      }
      const response = await this._paymentClient.post('payments', {
        Data: {
          Initiation: {
            LocalInstrument: provider,
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
            CreditorAccountExt: {
              BankCode: bankCode,
            },
            RemittanceInformation: {
              Unstructured: note,
            },
            SupplementaryData: {
              CustomFields: _customFields,
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

  public getPaymentMethod = async () => {
    if (this._paymentClient) {
      const response = await this._paymentClient.get('paymentMethods');
      return response.data;
    } else {
      throw new Error('Transfer Client is not registered');
    }
  };

  public getEBanks = async () => {
    if (this._paymentClient) {
      const response = await this._bankInformationClient.get('banks', {
        params: {
          pageSize: 1000,
        },
      });
      return response.data;
    } else {
      throw new Error('Bank Information Client is not registered');
    }
  };
}
