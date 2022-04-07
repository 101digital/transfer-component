import * as Yup from 'yup';

export class InputPaymentData {
  constructor(
    readonly accountNumber: string,
    readonly accountName: string,
    readonly accountId: string,
    readonly purposeTransfer: string,
    readonly otherPurposeTransfer?: string
  ) {}

  static empty(): InputPaymentData {
    return new InputPaymentData('', '', '', '', '');
  }

  static initial(
    accountNumber: string,
    accountName: string,
    accountId: string,
    purposeTransfer?: string,
    otherPurposeTransfer?: string
  ): InputPaymentData {
    return new InputPaymentData(
      accountNumber,
      accountName,
      accountId,
      purposeTransfer ?? '',
      otherPurposeTransfer
    );
  }
}

export const InputPaymentSchema = () =>
  Yup.object().shape({
    accountNumber: Yup.string().trim().required('Please enter account number'),
    accountName: Yup.string().trim().required('Please enter account name'),
  });
