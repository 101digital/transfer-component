import { TransferService } from '../service/transfer-service';
import React, { useCallback, useMemo, useState } from 'react';
import { EBank, PaymentMethod, PaymentProvider, Recipient, TransferResponse } from '../type';

const transferService = TransferService.instance();

export interface TransferContextData {
  isInitialingTransfer: boolean;
  initTransfer: (
    amount: number,
    currency: string,
    debtorAccountId: string,
    creditorAccountId: string,
    creditorName: string,
    provider?: PaymentProvider,
    transferPurpose?: string,
    otherPurpose?: string,
    note?: string
  ) => void;
  transferResponse?: TransferResponse;
  errorInitialTransfer?: Error;
  clearTransferResponse: () => void;
  clearErrors: () => void;
  isAuthorizingTransfer: boolean;
  authorizeTransfer: (otp: string) => void;
  errorAuthorizeTransfer?: Error;
  resendOtp: () => void;
  isResendingOtp: boolean;
  isSentOtp: boolean;
  errorResendOtp?: Error;
  isSearchingRecipient: boolean;
  recipient?: Recipient;
  searchRecipient: (myUserId?: string, mobileNumber?: string, accountNumber?: string) => void;
  errorSearchRecipient?: Error;
  clearRecipient: () => void;
  contacts: Recipient[];
  isLoadingContacts: boolean;
  getContacts: () => void;
  errorLoadContacts?: Error;
  isAddingContact: boolean;
  addContact: (accountId: string, accountNumber: string, displayName: string) => void;
  isAddedContact: boolean;
  errorAddContact?: Error;
  getPaymentMethod: () => void;
  errorGetPaymentMethod?: Error;
  isLoadingPaymentMethod: boolean;
  paymentMethods: PaymentMethod[];
  setPaymentMethod: (method: PaymentMethod) => void;
  paymentMethod?: PaymentMethod;
  eBanks: EBank[];
  isLoadingBank: boolean;
  getEBanks: () => void;
  errorGetEBanks?: Error;
}

export const transferDefaultValue: TransferContextData = {
  isInitialingTransfer: false,
  initTransfer: () => null,
  clearTransferResponse: () => null,
  clearErrors: () => null,
  isAuthorizingTransfer: false,
  authorizeTransfer: () => null,
  isResendingOtp: false,
  resendOtp: () => null,
  isSentOtp: false,
  isSearchingRecipient: false,
  searchRecipient: () => null,
  clearRecipient: () => null,
  contacts: [],
  isLoadingContacts: false,
  getContacts: () => null,
  isAddingContact: false,
  addContact: () => null,
  isAddedContact: false,
  paymentMethods: [],
  getPaymentMethod: () => null,
  isLoadingPaymentMethod: false,
  setPaymentMethod: () => null,
  eBanks: [],
  getEBanks: () => null,
  isLoadingBank: false,
};

export const TransferContext = React.createContext<TransferContextData>(transferDefaultValue);

export function useTransferContextValue(): TransferContextData {
  const [_transferResponse, setTransferResponse] = useState<TransferResponse | undefined>(
    undefined
  );
  const [_isInitialingTransfer, setInitialingTransfer] = useState(false);
  const [_errorInitialTransfer, setErrorInitialTransfer] = useState<Error | undefined>(undefined);

  const [_isAuthorizingTransfer, setAuthorizingTransfer] = useState(false);
  const [_errorAuthorizeTransfer, setErrorAuthorizeTransfer] = useState<Error | undefined>(
    undefined
  );
  const [_isResendingOtp, setResendingOtp] = useState(false);
  const [_errorResendOtp, setErrorResendOtp] = useState<Error | undefined>(undefined);
  const [_isSentOtp, setSentOtp] = useState(false);

  const [_isSearchingRecipient, setSearchingRecipient] = useState(false);
  const [_errorSearchRecipient, setErrorSearchRecipient] = useState<Error | undefined>(undefined);
  const [_recipient, setRecipient] = useState<Recipient | undefined>(undefined);

  const [_isLoadingContacts, setLoadingContacts] = useState(false);
  const [_contacts, setContacts] = useState<Recipient[]>([]);
  const [_errorLoadContact, setErrorLoadContact] = useState<Error | undefined>(undefined);

  const [_isAddingContact, setAddingContact] = useState(false);
  const [_errorAddContact, setErrorAddContact] = useState<Error | undefined>(undefined);
  const [_isAddedContact, setAddedContact] = useState(false);

  const [_isLoadingPaymentMethod, setLoadingPaymentMethods] = useState(false);
  const [_paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [_paymentMethod, _setPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [_errorGetPaymentMethod, setErrorGetPaymentMethod] = useState<Error | undefined>(undefined);

  const [_isLoadingEBank, setLoadingEBank] = useState(false);
  const [_eBanks, setEBanks] = useState<EBank[]>([]);
  const [_errorGetEBank, setErrorGetEBank] = useState<Error | undefined>(undefined);

  const addContact = useCallback(
    async (accountId: string, accountNumber: string, displayName: string) => {
      try {
        setAddingContact(true);
        await transferService.addContact(accountId, accountNumber, displayName);
        setAddedContact(true);
        setTimeout(() => {
          setAddedContact(false);
        }, 50);
        setAddingContact(false);
      } catch (error) {
        setAddingContact(false);
        setErrorAddContact(error as Error);
      }
    },
    []
  );

  const getContacts = useCallback(async () => {
    try {
      setLoadingContacts(true);
      const { data } = await transferService.getRecentContacts();
      setContacts(data);
      setLoadingContacts(false);
      // clearErrors();
    } catch (error) {
      setLoadingContacts(false);
      setErrorLoadContact(error as Error);
    }
  }, []);

  const getSchemeByProvider = (provider?: string) => {
    const schemes = transferService.getSchemes()!;
    switch (provider) {
      case 'Pesonet':
        return schemes.pesonetScheme;
      case 'Instapay':
        return schemes.instapayScheme;
      default:
        return schemes.udScheme;
    }
  };

  const initTransfer = useCallback(
    async (
      amount: number,
      currency: string,
      debtorAccountId: string,
      creditorAccountId: string,
      creditorName: string,
      provider?: PaymentProvider,
      transferPurpose?: string,
      otherPurpose?: string,
      note?: string
    ) => {
      try {
        setInitialingTransfer(true);
        const { Data } = await transferService.initTransfer(
          provider?.name ?? 'UD',
          amount,
          currency,
          {
            accountId: debtorAccountId,
            schemeName: getSchemeByProvider('UD'),
          },
          {
            accountId: creditorAccountId,
            name: creditorName,
            schemeName: getSchemeByProvider(provider?.name),
          },
          provider?.code,
          transferPurpose,
          otherPurpose,
          note
        );
        setInitialingTransfer(false);
        setTransferResponse({
          transferId: Data.DomesticPaymentId,
          status: Data.Status,
          transactionDate: Data.StatusUpdateDateTime,
        });
      } catch (error) {
        setInitialingTransfer(false);
        setErrorInitialTransfer(error as Error);
      }
    },
    []
  );

  const clearErrors = useCallback(() => {
    if (_errorInitialTransfer) {
      setErrorInitialTransfer(undefined);
    }
    if (_errorAuthorizeTransfer) {
      setErrorAuthorizeTransfer(undefined);
    }
    if (_errorResendOtp) {
      setErrorResendOtp(undefined);
    }
    if (_errorSearchRecipient) {
      setErrorSearchRecipient(undefined);
    }
    if (_errorAddContact) {
      setErrorAddContact(undefined);
    }
    if (_errorLoadContact) {
      setErrorLoadContact(undefined);
    }
    if (_errorGetPaymentMethod) {
      setErrorGetPaymentMethod(undefined);
    }
    if (_errorGetEBank) {
      setErrorGetEBank(undefined);
    }
  }, [
    _errorInitialTransfer,
    _errorAuthorizeTransfer,
    _errorResendOtp,
    _errorSearchRecipient,
    _errorAddContact,
    _errorLoadContact,
    _errorGetPaymentMethod,
    _errorGetEBank,
  ]);

  const clearTransferResponse = useCallback(() => {
    setTransferResponse(undefined);
  }, []);

  const authorizeTransfer = useCallback(
    async (otp: string) => {
      try {
        if (_transferResponse?.transferId) {
          setAuthorizingTransfer(true);
          const { Data } = await transferService.authorizePayment(
            _transferResponse.transferId,
            otp
          );
          setAuthorizingTransfer(false);
          setTransferResponse({
            ..._transferResponse,
            status: Data.Status,
            transactionDate: Data.StatusUpdateDateTime,
            referenceNo: Data.Initiation.SupplementaryData.PaymentServiceProviderExt.PspReference,
          });
        } else {
          throw new Error('Not found payment');
        }
      } catch (error) {
        setAuthorizingTransfer(false);
        setErrorAuthorizeTransfer(error as Error);
      }
    },
    [_transferResponse]
  );

  const resendOtp = useCallback(async () => {
    try {
      if (_transferResponse?.transferId) {
        setResendingOtp(true);
        await transferService.resendOTP(_transferResponse?.transferId);
        setSentOtp(true);
        setTimeout(() => {
          setSentOtp(false);
        }, 50);
        setResendingOtp(false);
      } else {
        throw new Error('Not found payment');
      }
    } catch (error) {
      setResendingOtp(false);
      setErrorResendOtp(error as Error);
    }
  }, [_transferResponse]);

  const searchRecipient = useCallback(
    async (myUserId?: string, mobileNumber?: string, accountNumber?: string) => {
      try {
        setSearchingRecipient(true);
        const { data } = await transferService.searchBeneficary(mobileNumber, accountNumber);
        setSearchingRecipient(false);
        const recipient = data[0];
        if (recipient.userId === myUserId) {
          setErrorSearchRecipient(
            new Error(
              `You can't place your own ${
                mobileNumber ? 'mobile' : 'account'
              } number. Please try other account number.`
            )
          );
          return;
        }
        setRecipient(recipient);
      } catch (err) {
        const error = err as Error;
        setSearchingRecipient(false);
        if (error.message.includes('404')) {
          setErrorSearchRecipient(
            new Error(
              `${mobileNumber ? 'Mobile' : 'Account'} number doesn't exist. Please try other ${
                mobileNumber ? 'mobile' : 'account'
              } number for you to proceed.`
            )
          );
        } else {
          setErrorSearchRecipient(
            new Error("We're having difficulty trying to connect to our server. Please try again")
          );
        }
      }
    },
    []
  );

  const clearRecipient = useCallback(() => {
    setRecipient(undefined);
  }, []);

  const getPaymentMethod = useCallback(async () => {
    try {
      setLoadingPaymentMethods(true);
      const { Data } = await transferService.getPaymentMethod();
      setPaymentMethods(Data);
      setLoadingPaymentMethods(false);
      // clearErrors();
    } catch (error) {
      setLoadingPaymentMethods(false);
      setErrorGetPaymentMethod(error as Error);
    }
  }, []);

  const setPaymentMethod = useCallback((method) => {
    _setPaymentMethod(method);
  }, []);

  const getEBanks = useCallback(async () => {
    try {
      setLoadingEBank(true);
      const { data } = await transferService.getEBanks();
      setEBanks(data);
      setLoadingEBank(false);
      // clearErrors();
    } catch (error) {
      setLoadingEBank(false);
      setErrorGetEBank(error as Error);
    }
  }, []);

  return useMemo(
    () => ({
      initTransfer,
      clearErrors,
      isInitialingTransfer: _isInitialingTransfer,
      errorInitialTransfer: _errorInitialTransfer,
      transferResponse: _transferResponse,
      clearTransferResponse,
      isAuthorizingTransfer: _isAuthorizingTransfer,
      errorAuthorizeTransfer: _errorAuthorizeTransfer,
      authorizeTransfer,
      isResendingOtp: _isResendingOtp,
      isSentOtp: _isSentOtp,
      errorResendOtp: _errorResendOtp,
      resendOtp,
      searchRecipient,
      isSearchingRecipient: _isSearchingRecipient,
      recipient: _recipient,
      errorSearchRecipient: _errorSearchRecipient,
      clearRecipient,
      getContacts,
      isLoadingContacts: _isLoadingContacts,
      contacts: _contacts,
      addContact,
      isAddedContact: _isAddedContact,
      isAddingContact: _isAddingContact,
      errorAddContact: _errorAddContact,
      getPaymentMethod,
      isLoadingPaymentMethod: _isLoadingPaymentMethod,
      paymentMethods: _paymentMethods,
      setPaymentMethod,
      paymentMethod: _paymentMethod,
      getEBanks,
      eBanks: _eBanks,
      isLoadingBank: _isLoadingEBank,
      errorLoadContacts: _errorLoadContact,
      errorGetPaymentMethod: _errorGetPaymentMethod,
      errorGetEBanks: _errorGetEBank,
    }),
    [
      _errorGetEBank,
      _errorGetPaymentMethod,
      _errorLoadContact,
      _isLoadingEBank,
      _eBanks,
      _paymentMethod,
      _isLoadingPaymentMethod,
      _paymentMethods,
      _isAddedContact,
      _isAddingContact,
      _errorAddContact,
      _isLoadingContacts,
      _contacts,
      _isSearchingRecipient,
      _recipient,
      _errorSearchRecipient,
      _isSentOtp,
      _errorResendOtp,
      _isResendingOtp,
      _isInitialingTransfer,
      _errorInitialTransfer,
      _transferResponse,
      _isAuthorizingTransfer,
      _errorAuthorizeTransfer,
    ]
  );
}
