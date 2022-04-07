import DetailsTransferComponent, {
  DetailsTransferComponentStyles,
} from '../../../detail-transfer-component';
import { TransferContext } from '../../../../../context/transfer-context';
import { TransferDetails } from '../../../../../type';
import moment from 'moment';
import React, { ReactNode, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Button, showMessage, ThemeContext } from 'react-native-theme-component';
import useMergeStyles from './styles';

export type TransferSuccessComponentProps = {
  transferDetails: TransferDetails;
  isFromContact: boolean;
  onBack: () => void;
  companyIcon?: ReactNode;
  transactionDateFormat?: string;
  detailTransferComponentStyle?: DetailsTransferComponentStyles;
  style?: TransferSuccessComponentStyles;
};

export type TransferSuccessComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  headerTextStyle?: StyleProp<TextStyle>;
  subHeaderTextStyle?: StyleProp<TextStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  valueTextStyle?: StyleProp<TextStyle>;
  addContactButton?: StyleProp<ViewStyle>;
  addContactButtonLabel?: StyleProp<TextStyle>;
};

const TransferSuccessComponent = ({
  style,
  transferDetails,
  isFromContact,
  onBack,
  companyIcon,
  detailTransferComponentStyle,
  transactionDateFormat,
}: TransferSuccessComponentProps) => {
  const styles: TransferSuccessComponentStyles = useMergeStyles(style);
  const { colors, i18n } = useContext(ThemeContext);
  const { transferResponse, addContact, isAddingContact, isAddedContact, getContacts } = useContext(
    TransferContext
  );

  const _addContactButtonColor = isFromContact ? '#BAB7BB' : colors.primaryButtonColor;
  const _dateFormat = transactionDateFormat ?? 'MMM D, YYYY / HH:mm A';

  useEffect(() => {
    if (isAddedContact) {
      getContacts();
      showMessage({
        message:
          i18n?.t('transfer_status_component.msg_contact_add_successful') ??
          'Contact is added successful',
        backgroundColor: '#2E7D32',
      });
    }
  }, [isAddedContact]);

  return (
    <SafeAreaView style={styles.containerStyle}>
      <ScrollView style={styles.mainContainerStyle}>
        <Text style={styles.headerTextStyle}>
          {i18n?.t('transfer_status_component.lbl_transfer_successful') ??
            'Transfer Request\nSuccessful!'}
        </Text>
        <Text style={styles.subHeaderTextStyle}>
          {i18n?.t('transfer_status_component.msg_transfer_successful') ??
            'Your money is on its way and should arrive instantly.'}
        </Text>
        <DetailsTransferComponent details={transferDetails} style={detailTransferComponentStyle} />
        {transferResponse?.transactionDate && (
          <View style={innerStyles.rowItem}>
            <Text style={styles.labelTextStyle}>
              {i18n?.t('transfer_status_component.lbl_transaction_date') ??
                'Transaction Date / Time'}
            </Text>
            <Text style={styles.valueTextStyle}>
              {moment(transferResponse.transactionDate).format(_dateFormat)}
            </Text>
          </View>
        )}
        {transferResponse?.referenceNo && (
          <View style={innerStyles.rowItem}>
            <Text style={styles.labelTextStyle}>
              {i18n?.t('transfer_status_component.lbl_reference_no') ?? 'Reference No.'}
            </Text>
            <Text style={styles.valueTextStyle}>{transferResponse?.referenceNo}</Text>
          </View>
        )}
        {companyIcon}
        <Button
          onPress={onBack}
          label={i18n?.t('transfer_status_component.btn_back_to_top') ?? 'Back to My Pitaka'}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isFromContact}
          style={[styles.addContactButton, { borderColor: _addContactButtonColor }]}
          onPress={() => {
            if (
              transferDetails.accountId &&
              transferDetails.accountName &&
              transferDetails.accountNumber
            ) {
              addContact(
                transferDetails.accountId,
                transferDetails.accountNumber,
                transferDetails.accountName
              );
            }
          }}
        >
          {isAddingContact && <ActivityIndicator color={_addContactButtonColor} />}
          <Text style={[styles.addContactButtonLabel, { color: _addContactButtonColor }]}>
            {i18n?.t('transfer_status_component.btn_add_contact') ?? 'Add to contacts'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const innerStyles = StyleSheet.create({
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
});

export default TransferSuccessComponent;
