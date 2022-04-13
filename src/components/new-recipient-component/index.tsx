import { Formik } from 'formik';
import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import {
  Platform,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { InputField, KeyboardSpace, Button, ThemeContext } from 'react-native-theme-component';
import { TransferContext } from '../../context/transfer-context';
import { Recipient } from '../../type';
import { NewRecipientData, NewRecipientSchema } from './model';
import { selectContactPhone } from 'react-native-select-contact';
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import useMergeStyles from './styles';
import AlertComponent, { AlertComponentStyles } from '../alert-component';
import { isEmpty } from 'lodash';

export type NewRecipientComponentProps = {
  userId: string;
  style?: NewRecipientComponentStyles;
  errorModal?: ReactNode;
  permissionModal?: (isVisible: boolean, setVisible: (value: boolean) => void) => ReactNode;
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
  selectDeviceContactStyle?: StyleProp<TextStyle>;
  alertComponentStyle?: AlertComponentStyles;
};

const NewRecipientComponent = ({
  style,
  userId,
  permissionModal,
  onNext,
  errorModal,
}: NewRecipientComponentProps) => {
  const styles: NewRecipientComponentStyles = useMergeStyles(style);
  const formikRef: any = useRef(null);
  const {
    searchRecipient,
    isSearchingRecipient,
    recipient,
    clearRecipient,
    errorSearchRecipient,
    clearErrors,
  } = useContext(TransferContext);
  const { i18n, colors } = useContext(ThemeContext);
  const [isShowPermission, setShowPermission] = useState(false);

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

  const requestContactPermission = () => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.READ_CONTACTS,
        default: PERMISSIONS.IOS.CONTACTS,
      })
    ).then((result) => {
      if (result === RESULTS.GRANTED) {
        return selectContactPhone().then((selection) => {
          if (!selection) {
            return null;
          }
          let { selectedPhone } = selection;
          formikRef?.current?.setFieldValue(
            'number',
            selectedPhone.number.replace(/[()\-\s]+/g, '')
          );
          return selectedPhone.number;
        });
      } else {
        setShowPermission(true);
      }
    });
  };

  return (
    <>
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
                  {values.type === 0 && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        requestContactPermission();
                      }}
                    >
                      <Text style={styles.selectDeviceContactStyle}>
                        {i18n?.t('new_recipient_component.btn_select_device_contact') ??
                          'Select from device contact'}
                      </Text>
                    </TouchableOpacity>
                  )}
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
      {permissionModal?.(isShowPermission, setShowPermission) ?? (
        <AlertComponent
          isVisible={isShowPermission}
          title={
            i18n?.t('new_recipient_component.lbl_permission_required') ?? 'Need contacts permission'
          }
          confirmTitle={i18n?.t('new_recipient_component.btn_open_settings') ?? 'Go to Settings'}
          cancelTitle={i18n?.t('new_recipient_component.btn_cancel') ?? 'Cancel'}
          message={
            i18n?.t('new_recipient_component.msg_permission_required') ??
            'The app needs permission in order to select from contacts. Please adjust this in your settings.'
          }
          onCancel={() => setShowPermission(false)}
          onConfirmed={() => {
            setShowPermission(false);
            openSettings();
          }}
          style={styles.alertComponentStyle}
        />
      )}
      {errorModal ?? (
        <AlertComponent
          isVisible={!isEmpty(errorSearchRecipient?.toString())}
          title={
            i18n?.t('new_recipient_component.lbl_something_went_wrong') ?? 'Something went wrong'
          }
          onConfirmed={clearErrors}
          onClose={clearErrors}
          message={errorSearchRecipient?.message.toString()}
          style={styles.alertComponentStyle}
        />
      )}
    </>
  );
};

export default NewRecipientComponent;
