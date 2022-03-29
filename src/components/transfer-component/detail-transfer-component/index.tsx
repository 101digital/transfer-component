import { isEmpty } from 'lodash';
import React, { useContext } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { ThemeContext, useCurrencyFormat } from 'react-native-theme-component';
import { TransferDetails } from '../../../type';
import useMergeStyles from './styles';

export type DetailsTransferComponentProps = {
  details: TransferDetails;
  style?: DetailsTransferComponentStyles;
};

export type DetailsTransferComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  valueTextStyle?: StyleProp<TextStyle>;
};

const DetailsTransferComponent = ({ style, details }: DetailsTransferComponentProps) => {
  const styles: DetailsTransferComponentStyles = useMergeStyles(style);
  const { colors, i18n } = useContext(ThemeContext);
  return (
    <View style={styles.containerStyle}>
      <Text style={styles.labelTextStyle}>
        {i18n?.t('detail_transfer_component.lbl_from') ?? 'From'}
      </Text>
      <Text style={styles.valueTextStyle}>My Pitaka</Text>
      <Text style={styles.labelTextStyle}>
        {i18n?.t('detail_transfer_component.lbl_send_money_to') ?? 'Send money to'}
      </Text>
      <Text style={styles.valueTextStyle}>{details.accountName}</Text>
      <Text style={styles.valueTextStyle}>{details.accountNumber}</Text>
      {!isEmpty(details.purpose) && (
        <>
          <Text style={styles.labelTextStyle}>
            {i18n?.t('detail_transfer_component.lbl_purpose_transfer') ?? 'Purpose of transfer'}
          </Text>
          <Text style={styles.valueTextStyle}>{details.purpose}</Text>
        </>
      )}
      {!isEmpty(details.note) && (
        <>
          <Text style={styles.labelTextStyle}>
            {i18n?.t('detail_transfer_component.lbl_note') ?? 'Note to recipient'}
          </Text>
          <Text style={styles.valueTextStyle}>{details.note}</Text>
        </>
      )}
      <Text style={styles.labelTextStyle}>
        {i18n?.t('detail_transfer_component.lbl_when') ?? 'When'}
      </Text>
      <Text style={styles.valueTextStyle}>Send instantly</Text>
      <Text style={styles.labelTextStyle}>
        {i18n?.t('detail_transfer_component.lbl_amount') ?? 'Amount'}
      </Text>
      <Text style={styles.valueTextStyle}>
        {useCurrencyFormat(details.amount, details.currencyCode)}
      </Text>
      <Text style={styles.labelTextStyle}>
        {i18n?.t('detail_transfer_component.lbl_transaction_fee') ?? 'Transaction Fee'}
      </Text>
      <Text style={styles.valueTextStyle}>{'FREE'}</Text>
      <Text style={styles.labelTextStyle}>
        {i18n?.t('detail_transfer_component.lbl_total_amount') ?? 'Total amount'}
      </Text>
      <Text style={[styles.valueTextStyle, { color: colors.primaryColor }]}>
        {useCurrencyFormat(details.amount, details.currencyCode)}
      </Text>
    </View>
  );
};

export default DetailsTransferComponent;