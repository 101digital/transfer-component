import { Recipient, EBank, PaymentCharge, PaymentProvider, TransferDetails } from '../../../type';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import useMergeStyles from './styles';
import { TransferContext } from '../../../context/transfer-context';
import { Formik } from 'formik';
import {
  Button,
  getAmountRawValue,
  InputField,
  KeyboardSpace,
  ThemeContext,
  useCurrencyFormat,
  useCurrencyOption,
} from 'react-native-theme-component';
import { InputAmountData, InputAmountSchema } from './model';
import ReceiverComponent, { ReceiverComponentStyles } from './components/receiver-component';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SelectMethodComponent, {
  SelectMethodComponentStyles,
} from './components/select-method-component';

export type InputAmountComponentProps = {
  recipient?: Recipient;
  eBank?: EBank;
  style?: InputAmountComponentStyles;
  currencyCode: string;
  transferDetails?: TransferDetails;
  onNext: (amount: number, charge: PaymentCharge, note: string, provider?: PaymentProvider) => void;
};

export type InputAmountComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  footerContainerStyle?: StyleProp<ViewStyle>;
  selectMethodComponentStyle?: SelectMethodComponentStyles;
  receiverComponentStyle?: ReceiverComponentStyles;
};

const InputAmountComponent = ({
  style,
  recipient,
  eBank,
  currencyCode,
  onNext,
  transferDetails,
}: InputAmountComponentProps) => {
  const styles: InputAmountComponentStyles = useMergeStyles(style);
  const { paymentMethod } = useContext(TransferContext);
  const formikRef: any = useRef(null);
  const currencyOption = useCurrencyOption(currencyCode, true, true);
  const { i18n, colors } = useContext(ThemeContext);
  const [charge, setCharge] = useState<PaymentCharge | undefined>(undefined);
  const [provider, setProvider] = useState<PaymentProvider | undefined>(undefined);

  useEffect(() => {
    if (recipient) {
      setCharge(paymentMethod?.Charges[0]);
    }
  }, [recipient, eBank]);

  useEffect(() => {
    if (transferDetails) {
      setProvider(transferDetails.provider);
      setCharge(transferDetails.charge);
    }
  }, [transferDetails]);

  useEffect(() => {
    setTimeout(() => {
      formikRef?.current?.validateForm();
    }, 0);
  }, []);

  return (
    <>
      <ReceiverComponent
        name={recipient?.displayName ?? eBank?.name ?? ''}
        accountNumber={recipient?.accountNumber}
        style={styles.receiverComponentStyle}
      />
      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={
          transferDetails
            ? InputAmountData.initial(
                transferDetails.amount?.toFixed(2) ?? '',
                transferDetails.note
              )
            : InputAmountData.empty()
        }
        validationSchema={InputAmountSchema(
          parseFloat(charge?.Min.toFixed(2) ?? '0.00'),
          parseFloat(charge?.Max.toFixed(2) ?? '1000000000000.00'),
          currencyOption,
          currencyCode
        )}
        onSubmit={(values) => {
          onNext(
            getAmountRawValue(values.amount, currencyOption),
            charge!,
            values.note ?? '',
            provider
          );
        }}
      >
        {({ isValid, submitForm }) => {
          return (
            <View style={styles.containerStyle}>
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
                style={styles.contentContainerStyle}
                keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
                showsVerticalScrollIndicator={false}
                extraScrollHeight={60}
              >
                <Text style={styles.labelTextStyle}>
                  {(
                    i18n?.t('input_amount_component.lbl_enter_amount') ??
                    'Enter amount (min. of %s)'
                  ).replace('%s', `${currencyCode} ${charge?.Min ?? 0}`)}
                </Text>
                <InputField
                  name={'amount'}
                  placeholder={(i18n?.t('input_amount_component.plh_enter_amount') ?? '%s').replace(
                    '%s',
                    useCurrencyFormat(0, currencyCode)
                  )}
                  maxLength={100}
                  type={'money'}
                  options={currencyOption}
                />
                <Text style={styles.labelTextStyle}>
                  {i18n?.t('input_amount_component.lbl_note') ?? 'Note to recipient (Optional)'}
                </Text>
                <InputField
                  scrollEnabled={false}
                  name={'note'}
                  placeholder={i18n?.t('input_amount_component.plh_note') ?? 'Add note'}
                  maxLength={100}
                  multiline
                  numberOfLines={3}
                  style={{
                    inputContainerStyle: {
                      height: 102,
                      alignItems: 'flex-start',
                      paddingHorizontal: 0,
                      paddingVertical: 10,
                    },
                  }}
                />
                {eBank && (
                  <SelectMethodComponent
                    eBank={eBank}
                    currencyCode={currencyCode}
                    initCharge={charge}
                    initProvider={provider}
                    onChangedValue={(_charge, _provider) => {
                      setCharge(_charge);
                      setProvider(_provider);
                    }}
                    style={styles.selectMethodComponentStyle}
                  />
                )}
              </KeyboardAwareScrollView>
              <KeyboardSpace style={styles.footerContainerStyle}>
                <Button
                  onPress={submitForm}
                  label={i18n?.t('input_amount_component.btn_proceed') ?? 'Proceed'}
                  disabled={!isValid || !charge}
                  disableColor={colors.secondaryButtonColor}
                />
              </KeyboardSpace>
            </View>
          );
        }}
      </Formik>
    </>
  );
};

export default InputAmountComponent;
