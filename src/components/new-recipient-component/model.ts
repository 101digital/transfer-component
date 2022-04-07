import * as Yup from 'yup';

export class NewRecipientData {
  constructor(readonly type: number, readonly number: string) {}

  static empty(): NewRecipientData {
    return new NewRecipientData(0, '');
  }
}

export const NewRecipientSchema = () =>
  Yup.object().shape({
    number: Yup.string()
      .when(['type'], {
        is: (type: number) => type === 0,
        then: Yup.string().required('Please enter mobile number'),
      })
      .when(['type'], {
        is: (type: number) => type === 1,
        then: Yup.string().required('Please enter UD account number'),
      }),
  });
