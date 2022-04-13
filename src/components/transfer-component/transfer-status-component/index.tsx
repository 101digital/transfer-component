import React, {
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ShareOptions } from 'react-native-share';
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
  TransferSuccessComponentRef,
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

export type TransferStatusComponentRef = {
  share: (shareOptions?: ShareOptions) => void;
};

const TransferStatusComponent = forwardRef(
  (
    {
      style,
      goBack,
      transferDetails,
      isFromContact,
      onChangedStatus,
      companyIcon,
    }: TransferStatusComponentProps,
    ref
  ) => {
    const styles: TransferStatusComponentStyles = useMergeStyles(style);
    const [status, setStatus] = useState<TransferStatus>(TransferStatus.progressing);
    const { transferResponse, errorAuthorizeTransfer, clearTransferResponse } =
      useContext(TransferContext);

    const successComponentRef = useRef<TransferSuccessComponentRef>();

    useImperativeHandle(
      ref,
      (): TransferStatusComponentRef => ({
        share,
      })
    );

    const share = (shareOptions?: ShareOptions) =>
      successComponentRef?.current?.share(shareOptions);

    useEffect(() => {
      onChangedStatus(status);
    }, [status]);

    useEffect(() => {
      return () => {
        clearTransferResponse();
      };
    }, []);

    useEffect(() => {
      if (
        transferResponse &&
        (transferResponse.status === 'AcceptedSettlementInProcess' ||
          transferResponse.status === 'Pending')
      ) {
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
            ref={successComponentRef}
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
  }
);

export default TransferStatusComponent;
