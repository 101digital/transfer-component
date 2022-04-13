import { Formik } from 'formik';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, InputField, KeyboardSpace, ThemeContext } from 'react-native-theme-component';
import { ArrowDownIcon } from '../../../assets/icons';
import { Recipient, TransferDetails } from '../../../type';
import SelectPurposeModal, { SelectPurposeModalStyles } from './components/select-purpose-modal';
import { InputPaymentData, InputPaymentSchema } from './model';
import useMergeStyles from './styles';

export type InputTransferComponentProps = {
  style?: InputTransferComponentStyles;
  transferDetails?: TransferDetails;
  recipient?: Recipient;
  currencyCode: string;
  onSubmit: (details: TransferDetails) => void;
};

export type InputTransferComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  footerContainerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  suffixContainerStyle?: StyleProp<ViewStyle>;
  purposeModalComponentStyle?: SelectPurposeModalStyles;
  countLengthStyle?: StyleProp<TextStyle>;
};

const InputTransferComponent = ({
  style,
  recipient,
  onSubmit,
  currencyCode,
  transferDetails,
}: InputTransferComponentProps) => {
  const styles: InputTransferComponentStyles = useMergeStyles(style);
  const { colors, i18n } = useContext(ThemeContext);
  const formikRef: any = useRef(null);
  const [openPurposeModal, setOpenPurposeModal] = useState(false);

  useEffect(() => {
    if (recipient) {
      formikRef?.current?.setFieldValue('accountNumber', recipient.accountNumber);
      formikRef?.current?.setFieldValue('accountName', recipient.displayName);
      formikRef?.current?.setFieldValue('accountId', recipient.paymentReference);
      setTimeout(() => {
        formikRef?.current?.validateForm();
      }, 0);
    }
  }, [recipient]);

  useEffect(() => {
    setTimeout(() => {
      formikRef?.current?.validateForm();
    }, 0);
  }, []);

  return (
    <>
      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={
          transferDetails
            ? InputPaymentData.initial(
                transferDetails?.accountName ?? '',
                transferDetails?.accountNumber ?? '',
                transferDetails?.accountId ?? '',
                transferDetails.purpose,
                transferDetails.otherPurpose,
                transferDetails.note
              )
            : InputPaymentData.empty()
        }
        validationSchema={InputPaymentSchema()}
        onSubmit={(values) => {
          onSubmit({
            ...values,
            purpose: values.purposeTransfer,
            otherPurpose: values.otherPurposeTransfer,
            currencyCode,
          });
        }}
      >
        {({ isValid, submitForm, values }) => {
          const _isOther = values.purposeTransfer === 'Others';
          return (
            <View style={styles.containerStyle}>
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                style={styles.contentContainerStyle}
                keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
                showsVerticalScrollIndicator={false}
                extraScrollHeight={60}
              >
                <Text style={styles.labelTextStyle}>
                  {i18n?.t('input_transfer_component.lbl_account_number') ?? 'Account number'}
                </Text>
                <InputField
                  name={'accountNumber'}
                  placeholder={
                    i18n?.t('input_transfer_component.plh_account_number') ?? 'Enter account number'
                  }
                  maxLength={100}
                  keyboardType="number-pad"
                  editable={recipient === undefined}
                />
                <Text style={styles.labelTextStyle}>
                  {i18n?.t('input_transfer_component.lbl_account_name') ?? 'Account name'}
                </Text>
                <InputField
                  name={'accountName'}
                  placeholder={
                    i18n?.t('input_transfer_component.plh_account_name') ?? 'Enter account name'
                  }
                  maxLength={100}
                  editable={recipient === undefined}
                />
                <Text style={styles.labelTextStyle}>
                  {i18n?.t('input_transfer_component.lbl_purpose_transfer') ??
                    'Purpose of transfer'}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setOpenPurposeModal(true);
                  }}
                >
                  <InputField
                    name={'purposeTransfer'}
                    placeholder={
                      i18n?.t('input_transfer_component.plh_select_purpose_transfer') ??
                      'Select a purpose'
                    }
                    pointerEvents="none"
                    editable={false}
                    suffixIcon={
                      <View style={styles.suffixContainerStyle}>
                        <ArrowDownIcon size={16} color={'#000000'} />
                      </View>
                    }
                  />
                </TouchableOpacity>
                {_isOther && (
                  <>
                    <InputField
                      scrollEnabled={false}
                      name={'otherPurposeTransfer'}
                      placeholder={
                        i18n?.t('input_transfer_component.plh_enter_purpose_transfer') ??
                        'Enter purpose of transfer'
                      }
                      maxLength={100}
                      multiline
                      numberOfLines={3}
                      style={{
                        containerStyle: {
                          marginTop: 8,
                        },
                        inputContainerStyle: {
                          height: 102,
                          alignItems: 'flex-start',
                          paddingHorizontal: 0,
                          paddingVertical: 10,
                        },
                      }}
                    />
                    <Text style={styles.countLengthStyle}>{`${
                      values.otherPurposeTransfer?.length ?? 0
                    } / 100`}</Text>
                  </>
                )}
                {transferDetails?.transferType === 'OTHERS' && (
                  <>
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
                    <Text style={styles.countLengthStyle}>{`${
                      values.note?.length ?? 0
                    } / 100`}</Text>
                  </>
                )}
              </KeyboardAwareScrollView>
              <KeyboardSpace style={styles.footerContainerStyle}>
                <Button
                  onPress={submitForm}
                  label={i18n?.t('input_transfer_component.btn_next') ?? 'Next'}
                  disabled={!isValid}
                  disableColor={colors.secondaryButtonColor}
                />
              </KeyboardSpace>
            </View>
          );
        }}
      </Formik>
      <SelectPurposeModal
        initValue={formikRef?.current?.values.purposeTransfer}
        isVisible={openPurposeModal}
        onClose={() => setOpenPurposeModal(false)}
        onValueChanged={(value) => {
          setOpenPurposeModal(false);
          formikRef?.current.setFieldValue('purposeTransfer', value.label);
        }}
        style={styles.purposeModalComponentStyle}
      />
    </>
  );
};

export default InputTransferComponent;
