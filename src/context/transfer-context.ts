import { TransferService } from './../service/transfer-service';
import React, { useCallback, useMemo, useState } from 'react';
import { Recipient, TransferResponse } from '../type';

const transferService = TransferService.instance();

export interface TransferContextData {
  isInitialingTransfer: boolean;
  initTransfer: (
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
  isAddingContact: boolean;
  addContact: (accountId: string, accountNumber: string, displayName: string) => void;
  isAddedContact: boolean;
  errorAddContact?: Error;
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

  const [_isAddingContact, setAddingContact] = useState(false);
  const [_errorAddContact, setErrorAddContact] = useState<Error | undefined>(undefined);
  const [_isAddedContact, setAddedContact] = useState(false);

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
    } catch (error) {
      setLoadingContacts(false);
    }
  }, []);

  const initTransfer = useCallback(
    async (
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
      try {
        setInitialingTransfer(true);
        const { Data } = await transferService.initTransfer(
          amount,
          currency,
          debtor,
          creditor,
          transferPurpose,
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
  }, [
    _errorInitialTransfer,
    _errorAuthorizeTransfer,
    _errorResendOtp,
    _errorSearchRecipient,
    _errorAddContact,
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
    }),
    [
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
