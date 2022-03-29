import { Formik } from 'formik';
import React, { useContext, useEffect, useRef } from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { InputField, KeyboardSpace, Button, ThemeContext } from 'react-native-theme-component';
import { TransferContext } from '../../context/transfer-context';
import { Recipient } from '../../type';
import { NewRecipientData, NewRecipientSchema } from './model';
import useMergeStyles from './styles';

export type NewRecipientComponentProps = {
  userId: string;
  style?: NewRecipientComponentStyles;
  onNext: (recipient: Recipient) => void;
};

export type NewRecipientComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  sendMoneyToLabelStyle?: StyleProp<TextStyle>;
  selectTypeContainerStyle?: StyleProp<ViewStyle>;
  typeContainerStyle?: StyleProp<ViewStyle>;
  typeLabelStyle?: StyleProp<TextStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  footerContainerStyle?: StyleProp<ViewStyle>;
  headerTitleStyle?: StyleProp<TextStyle>;
  headerSubTitleStyle?: StyleProp<TextStyle>;
};

const NewRecipientComponent = ({ style, userId, onNext }: NewRecipientComponentProps) => {
  const styles: NewRecipientComponentStyles = useMergeStyles(style);
  const formikRef: any = useRef(null);
  const { searchRecipient, isSearchingRecipient, recipient, clearRecipient } = useContext(
    TransferContext
  );
  const { i18n, colors } = useContext(ThemeContext);

  useEffect(() => {
    if (recipient) {
      onNext(recipient);
      clearRecipient();
    }
  }, [recipient]);

  useEffect(() => {
    setTimeout(() => {
      formikRef?.current?.validateForm();
    }, 0);
  }, []);

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.headerTitleStyle}>
        {i18n?.t('new_recipient_component.lbl_header_title') ?? 'New Recipient'}
      </Text>
      <Text style={styles.headerSubTitleStyle}>
        {i18n?.t('new_recipient_component.lbl_header_subtitle') ??
          "Please enter recipient's mobile no. or account number."}
      </Text>
      <Text style={styles.sendMoneyToLabelStyle}>
        {i18n?.t('new_recipient_component.lbl_send_money_to') ?? 'Send money to'}
      </Text>
      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={NewRecipientData.empty()}
        validationSchema={NewRecipientSchema()}
        onSubmit={(values) => {
          const { type, number } = values;
          const mobileNumber = type === 0 ? number : undefined;
          const accountNumber = type === 1 ? number : undefined;
          searchRecipient(userId, mobileNumber, accountNumber);
        }}
      >
        {({ isValid, setFieldValue, values, submitForm, resetForm }) => {
          const _mobileBackgroundColor =
            values.type === 0 ? 'rgba(255, 183, 76, 0.15)' : 'transparent';
          const _accountBackgroundColor =
            values.type === 1 ? 'rgba(255, 183, 76, 0.15)' : 'transparent';
          return (
            <>
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
                style={styles.contentContainerStyle}
                keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
                showsVerticalScrollIndicator={false}
                extraScrollHeight={60}
              >
                <View style={styles.selectTypeContainerStyle}>
                  <TouchableOpacity
                    onPress={() => {
                      resetForm();
                      setFieldValue('type', 0);
                    }}
                    activeOpacity={0.8}
                    style={[
                      styles.typeContainerStyle,
                      {
                        backgroundColor: _mobileBackgroundColor,
                      },
                    ]}
                  >
                    <Text style={styles.typeLabelStyle}>
                      {i18n?.t('new_recipient_component.btn_mobile') ?? 'Mobile'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      resetForm();
                      setFieldValue('type', 1);
                    }}
                    activeOpacity={0.8}
                    style={[
                      styles.typeContainerStyle,
                      {
                        backgroundColor: _accountBackgroundColor,
                      },
                    ]}
                  >
                    <Text style={styles.typeLabelStyle}>
                      {i18n?.t('new_recipient_component.btn_account') ?? 'Account'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.labelTextStyle}>
                  {values.type === 0
                    ? i18n?.t('new_recipient_component.lbl_mobile_number') ?? 'Mobile number'
                    : i18n?.t('new_recipient_component.lbl_account_number') ?? 'Account number'}
                </Text>
                <InputField
                  name={'number'}
                  placeholder={
                    values.type === 0
                      ? i18n?.t('new_recipient_component.plh_mobile_number') ??
                        'ex. 09123456789 or +639123456789'
                      : i18n?.t('new_recipient_component.plh_account_number') ??
                        'Enter account number'
                  }
                  maxLength={100}
                />
              </KeyboardAwareScrollView>
              <KeyboardSpace style={styles.footerContainerStyle}>
                <Button
                  onPress={submitForm}
                  label={i18n?.t('new_recipient_component.btn_proceed') ?? 'Proceed'}
                  isLoading={isSearchingRecipient}
                  disabled={!isValid}
                  disableColor={colors.secondaryButtonColor}
                />
              </KeyboardSpace>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default NewRecipientComponent;
