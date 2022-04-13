import * as Yup from 'yup';

export class InputPaymentData {
  constructor(
    readonly accountNumber: string,
    readonly accountName: string,
    readonly accountId: string,
    readonly purposeTransfer: string,
    readonly otherPurposeTransfer?: string,
    readonly note?: string
  ) {}

  static empty(): InputPaymentData {
    return new InputPaymentData('', '', '', '', '');
  }

  static initial(
    accountNumber: string,
    accountName: string,
    accountId: string,
    purposeTransfer?: string,
    otherPurposeTransfer?: string,
    note?: string
  ): InputPaymentData {
    return new InputPaymentData(
      accountNumber,
      accountName,
      accountId,
      purposeTransfer ?? '',
      otherPurposeTransfer,
      note
    );
  }
}

export const InputPaymentSchema = () =>
  Yup.object().shape({
    accountNumber: Yup.string().trim().required('Please enter account number'),
    accountName: Yup.string().trim().required('Please enter account name'),
    purposeTransfer: Yup.string().trim().required('Please select purpose of transfer'),
  });
