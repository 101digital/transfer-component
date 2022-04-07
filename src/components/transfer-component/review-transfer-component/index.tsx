import React, { useContext } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { Button, ThemeContext } from 'react-native-theme-component';
import { TransferContext } from '../../../context/transfer-context';
import { TransferDetails } from '../../../type';
import DetailsTransferComponent, {
  DetailsTransferComponentStyles,
} from '../detail-transfer-component';
import useMergeStyles from './styles';

export type ReviewTransferComponentProps = {
  style?: ReviewTransferComponentStyles;
  userAccountId: string;
  transferDetail: TransferDetails;
};

export type ReviewTransferComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  footerContainerStyle?: StyleProp<ViewStyle>;
  detailTransferComponentStyle?: DetailsTransferComponentStyles;
};

const ReviewTransferComponent = ({
  style,
  transferDetail,
  userAccountId,
}: ReviewTransferComponentProps) => {
  const styles: ReviewTransferComponentStyles = useMergeStyles(style);
  const {
    accountName,
    accountId,
    amount,
    purpose,
    note,
    currencyCode,
    provider,
    otherPurpose,
    accountNumber,
  } = transferDetail;
  const { isInitialingTransfer, initTransfer } = useContext(TransferContext);
  const { i18n } = useContext(ThemeContext);

  return (
    <>
      <View style={styles.containerStyle}>
        <ScrollView style={styles.contentContainerStyle}>
          <DetailsTransferComponent
            details={transferDetail}
            style={styles.detailTransferComponentStyle}
          />
        </ScrollView>
        <View style={styles.footerContainerStyle}>
          <Button
            label={
              i18n?.t('review_transfer_component.btn_confirm_transaction') ?? 'Confirm transaction'
            }
            isLoading={isInitialingTransfer}
            onPress={() => {
              const creaditorAccId = provider ? accountNumber : accountId;
              if (creaditorAccId && accountName && amount && currencyCode) {
                initTransfer(
                  amount,
                  currencyCode,
                  userAccountId,
                  creaditorAccId,
                  accountName,
                  provider,
                  purpose,
                  otherPurpose,
                  note
                );
              }
            }}
          />
        </View>
      </View>
    </>
  );
};

export default ReviewTransferComponent;
