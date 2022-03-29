import * as Yup from 'yup';
import { getAmountRawValue } from 'react-native-theme-component';

export class InputPaymentData {
  constructor(
    readonly accountNumber: string,
    readonly accountName: string,
    readonly accountId: string,
    readonly amount: string,
    readonly purposeTransfer: string,
    readonly note?: string,
    readonly otherPurposeTransfer?: string
  ) {}

  static empty(): InputPaymentData {
    return new InputPaymentData('', '', '', '', '');
  }
}

export const InputPaymentSchema = (maxAmount: number, paymentOption: any) =>
  Yup.object().shape({
    accountNumber: Yup.string().trim().required('Please enter account number'),
    accountName: Yup.string().trim().required('Please enter account name'),
    amount: Yup.number()
      .required('Please enter amount')
      .transform((data, originalValue) => {
        if (isNaN(data)) {
          return getAmountRawValue(originalValue, paymentOption);
        }
        return data;
      })
      .moreThan(1 - 0.0001, 'Invalid amount')
      .lessThan(maxAmount, 'Invalid amount'),
  });
