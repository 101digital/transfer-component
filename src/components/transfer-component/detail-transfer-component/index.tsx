import { PenIcon } from '../../../assets/icons';
import { isEmpty } from 'lodash';
import React, { useContext } from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ThemeContext, useCurrencyFormat } from 'react-native-theme-component';
import { TransferDetails } from '../../../type';
import useMergeStyles from './styles';

export type DetailsTransferComponentProps = {
  details: TransferDetails;
  style?: DetailsTransferComponentStyles;
  onEditReceiver?: () => void;
  onEditAmount?: () => void;
};

export type DetailsTransferComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  valueTextStyle?: StyleProp<TextStyle>;
  editReceiverButtonStyle?: StyleProp<ViewStyle>;
  editAmountButtonStyle?: StyleProp<ViewStyle>;
};

const DetailsTransferComponent = ({
  style,
  details,
  onEditAmount,
  onEditReceiver,
}: DetailsTransferComponentProps) => {
  const styles: DetailsTransferComponentStyles = useMergeStyles(style);
  const { colors, i18n } = useContext(ThemeContext);

  const _purpose =
    details.purpose === 'Others' ? `${details.purpose}\n${details.otherPurpose}` : details.purpose;

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.labelTextStyle}>
        {i18n?.t('detail_transfer_component.lbl_from') ?? 'From'}
      </Text>
      <Text style={styles.valueTextStyle}>{'My Pitaka'}</Text>
      <View>
        <Text style={styles.labelTextStyle}>
          {i18n?.t('detail_transfer_component.lbl_send_money_to') ?? 'Send money to'}
        </Text>
        {details.bankName && <Text style={styles.valueTextStyle}>{details.bankName}</Text>}
        <Text style={styles.valueTextStyle}>{details.accountName}</Text>
        <Text style={styles.valueTextStyle}>{details.accountNumber}</Text>
        {onEditReceiver && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.editReceiverButtonStyle}
            onPress={onEditReceiver}
          >
            <PenIcon width={20} height={20} />
          </TouchableOpacity>
        )}
      </View>
      {!isEmpty(_purpose) && (
        <>
          <Text style={styles.labelTextStyle}>
            {i18n?.t('detail_transfer_component.lbl_purpose_transfer') ?? 'Purpose of transfer'}
          </Text>
          <Text style={styles.valueTextStyle}>{_purpose}</Text>
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
      {details.provider === undefined ? (
        <>
          <Text style={styles.labelTextStyle}>
            {i18n?.t('detail_transfer_component.lbl_when') ?? 'When'}
          </Text>
          <Text style={styles.valueTextStyle}>{'Send instantly'}</Text>
        </>
      ) : (
        <>
          <Text style={styles.labelTextStyle}>
            {i18n?.t('detail_transfer_component.lbl_send_via') ?? 'Send via'}
          </Text>
          <Text style={styles.valueTextStyle}>{details.charge?.Provider}</Text>
        </>
      )}
      <View>
        <Text style={styles.labelTextStyle}>
          {i18n?.t('detail_transfer_component.lbl_amount') ?? 'Amount'}
        </Text>
        <Text style={styles.valueTextStyle}>
          {useCurrencyFormat(details.amount ?? 0, details.currencyCode ?? 'USD')}
        </Text>
        {onEditAmount && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.editAmountButtonStyle}
            onPress={onEditAmount}
          >
            <PenIcon width={20} height={20} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.labelTextStyle}>
        {i18n?.t('detail_transfer_component.lbl_transaction_fee') ?? 'Transaction Fee'}
      </Text>
      <Text style={styles.valueTextStyle}>
        {details.charge?.Fee === 0
          ? i18n?.t('detail_transfer_component.lbl_free') ?? 'FREE'
          : useCurrencyFormat(details.amount ?? 0, details.currencyCode ?? 'USD')}
      </Text>
      <Text style={styles.labelTextStyle}>
        {i18n?.t('detail_transfer_component.lbl_total_amount') ?? 'Total amount'}
      </Text>
      <Text style={[styles.valueTextStyle, { color: colors.primaryColor }]}>
        {useCurrencyFormat(
          (details.amount ?? 0) + (details.charge?.Fee ?? 0),
          details.currencyCode ?? 'USD'
        )}
      </Text>
    </View>
  );
};

export default DetailsTransferComponent;
