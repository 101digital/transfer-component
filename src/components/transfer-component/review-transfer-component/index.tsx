import React, { useContext } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { Button } from 'react-native-theme-component';
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
  const { accountName, accountId, amount, purpose, note, currencyCode } = transferDetail;
  const { isInitialingTransfer, initTransfer } = useContext(TransferContext);

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
            label="Confirm transaction"
            isLoading={isInitialingTransfer}
            onPress={() => {
              initTransfer(
                amount,
                currencyCode,
                {
                  accountId: userAccountId,
                  schemeName: 'PH.PlatformDefined.Id',
                },
                {
                  accountId,
                  schemeName: 'PH.PlatformDefined.Id',
                  name: accountName,
                },
                purpose,
                note
              );
            }}
          />
        </View>
      </View>
    </>
  );
};

export default ReviewTransferComponent;
