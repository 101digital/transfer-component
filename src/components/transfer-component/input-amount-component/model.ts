import * as Yup from 'yup';
import { getAmountRawValue, useCurrencyFormat } from 'react-native-theme-component';

export class InputAmountData {
  constructor(readonly amount: string, readonly note?: string) {}

  static empty(): InputAmountData {
    return new InputAmountData('', '');
  }

  static initial(amount: string, note?: string): InputAmountData {
    return new InputAmountData(amount, note);
  }
}

export const InputAmountSchema = (
  minAmount: number,
  maxAmount: number,
  paymentOption: any,
  currencyCode: string
) =>
  Yup.object().shape({
    amount: Yup.number()
      .required('Please enter amount')
      .transform((data, originalValue) => {
        if (isNaN(data)) {
          return getAmountRawValue(originalValue, paymentOption);
        }
        return data;
      })
      .moreThan(
        minAmount - 0.01,
        `Allowed minimum amount to send is ${useCurrencyFormat(minAmount, currencyCode)}`
      )
      .lessThan(
        maxAmount + 0.01,
        `Allowed maximum amount to send is ${useCurrencyFormat(maxAmount, currencyCode)}`
      ),
  });
