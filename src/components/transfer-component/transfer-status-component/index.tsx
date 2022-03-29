import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TransferContext } from '../../../context/transfer-context';
import { TransferDetails, TransferStatus } from '../../../type';
import { DetailsTransferComponentStyles } from '../detail-transfer-component';
import ProgressingTransferComponent, {
  ProgressingTransferComponentStyles,
} from './components/progressing-transfer-component';
import TransferFailedComponent, {
  TransferFailedComponentStyles,
} from './components/transfer-failed-component';
import TransferSuccessComponent, {
  TransferSuccessComponentStyles,
} from './components/transfer-success-component';
import useMergeStyles from './styles';

export type TransferStatusComponentProps = {
  transferDetails: TransferDetails;
  isFromContact: boolean;
  goBack: () => void;
  companyIcon?: ReactNode;
  transactionDateFormat?: string;
  style?: TransferStatusComponentStyles;
  onChangedStatus: (status: TransferStatus) => void;
};

export type TransferStatusComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  progressingComponentStyle?: ProgressingTransferComponentStyles;
  failedComponentStyle?: TransferFailedComponentStyles;
  successComponentStyle?: TransferSuccessComponentStyles;
  detailTransferComponentStyle?: DetailsTransferComponentStyles;
};

const TransferStatusComponent = ({
  style,
  goBack,
  transferDetails,
  isFromContact,
  onChangedStatus,
  companyIcon,
}: TransferStatusComponentProps) => {
  const styles: TransferStatusComponentStyles = useMergeStyles(style);
  const [status, setStatus] = useState<TransferStatus>(TransferStatus.progressing);
  const { transferResponse, errorAuthorizeTransfer, clearTransferResponse } =
    useContext(TransferContext);

  useEffect(() => {
    onChangedStatus(status);
  }, [status]);

  useEffect(() => {
    return () => {
      clearTransferResponse();
    };
  }, []);

  useEffect(() => {
    if (transferResponse && transferResponse.status === 'AcceptedSettlementInProcess') {
      setStatus(TransferStatus.success);
    }
  }, [transferResponse]);

  useEffect(() => {
    if (errorAuthorizeTransfer) {
      setStatus(TransferStatus.failed);
    }
  }, [errorAuthorizeTransfer]);

  return (
    <View style={styles.containerStyle}>
      {status === TransferStatus.progressing && (
        <ProgressingTransferComponent style={styles.progressingComponentStyle} />
      )}
      {status === TransferStatus.success && (
        <TransferSuccessComponent
          transferDetails={transferDetails}
          onBack={goBack}
          companyIcon={companyIcon}
          isFromContact={isFromContact}
          style={styles.successComponentStyle}
        />
      )}
      {status === TransferStatus.failed && (
        <TransferFailedComponent onBack={goBack} style={styles.failedComponentStyle} />
      )}
    </View>
  );
};

export default TransferStatusComponent;
