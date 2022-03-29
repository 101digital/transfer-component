import React, {
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { TransferContext } from '../../context/transfer-context';
import { Recipient, TransferDetails, TransferStatus } from '../../type';
import AuthorizeTransferComponent, {
  AuthorizeTransferComponentStyles,
} from './authorize-transfer-component';
import InputTransferComponent, { InputTransferComponentStyles } from './input-transfer-component';
import ReviewTransferComponent, {
  ReviewTransferComponentStyles,
} from './review-transfer-component';
import useMergeStyles from './styles';
import TransferStatusComponent, {
  TransferStatusComponentStyles,
} from './transfer-status-component';

export type TransferComponentProps = {
  recipient?: Recipient;
  companyIcon?: ReactNode;
  isFromContact?: boolean;
  userAccountId: string;
  maxAmount: number;
  onDone: () => void;
  currencyCode: string;
  transactionDateFormat?: string;
  style?: TransferComponentStyles;
  onChangedStep: (step: TransferStep) => void;
  onChangedStatus: (status: TransferStatus) => void;
};

export type TransferComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  headerTitleStyle?: StyleProp<TextStyle>;
  headerSubTitleStyle?: StyleProp<TextStyle>;
  inputTransferComponentStyle?: InputTransferComponentStyles;
  reviewTransferComponentStyle?: ReviewTransferComponentStyles;
  authorizeTransferComponentStyle?: AuthorizeTransferComponentStyles;
  transferStatusComponentStyle?: TransferStatusComponentStyles;
};

export enum TransferStep {
  initial,
  review,
  authorize,
  status,
}

export type TransferComponentRef = {
  changeStep: (step: TransferStep) => void;
};

const TransferComponent = forwardRef((props: TransferComponentProps, ref) => {
  const {
    style,
    onChangedStep,
    recipient,
    isFromContact,
    userAccountId,
    maxAmount,
    onDone,
    onChangedStatus,
    currencyCode,
    companyIcon,
    transactionDateFormat,
  } = props;
  const styles: TransferComponentStyles = useMergeStyles(style);
  const [step, setStep] = useState<TransferStep>(TransferStep.initial);
  const { transferResponse, isAuthorizingTransfer } = useContext(TransferContext);
  const [transferDetails, setTransferDetails] = useState<TransferDetails | undefined>(undefined);
  const { i18n } = useContext(ThemeContext);

  useEffect(() => {
    return () => {
      setStep(TransferStep.initial);
    };
  }, []);

  useEffect(() => {
    if (isAuthorizingTransfer) {
      setStep(TransferStep.status);
    }
  }, [isAuthorizingTransfer]);

  useEffect(() => {
    if (transferResponse && step === TransferStep.review) {
      setStep(TransferStep.authorize);
    }
  }, [transferResponse]);

  useEffect(() => {
    onChangedStep(step);
  }, [step]);

  useImperativeHandle(
    ref,
    (): TransferComponentRef => ({
      changeStep,
    })
  );

  const changeStep = (_step: TransferStep) => {
    setStep(_step);
  };

  const getStepHeaderInformation = () => {
    switch (step) {
      case TransferStep.initial:
        return {
          title: i18n?.t('input_transfer_component.lbl_header_title') ?? 'Send now to',
          subTitle:
            i18n?.t('input_transfer_component.lbl_header_subtitle') ??
            "Please enter recipient's details below.",
        };
      case TransferStep.review:
        return {
          title: i18n?.t('review_transfer_component.lbl_header_title') ?? 'Review transfer',
          subTitle:
            i18n?.t('review_transfer_component.lbl_header_subtitle') ??
            'Please make sure all account details are correct. Your account will be debited and this transaction will be irreversible once confirmed.',
        };
      case TransferStep.authorize:
        return {
          title:
            i18n?.t('authorize_transfer_component.lbl_header_title') ??
            'Please enter your passcode',
          subTitle:
            i18n?.t('authorize_transfer_component.lbl_header_subtitle') ??
            'Enter the One-Time Password (OTP) sent on your registered mobile number.',
        };
      default:
        return undefined;
    }
  };

  const headerInformation = getStepHeaderInformation();

  return (
    <View style={styles.containerStyle}>
      {headerInformation && (
        <>
          <Text style={styles.headerTitleStyle}>{headerInformation.title}</Text>
          <Text style={styles.headerSubTitleStyle}>{headerInformation.subTitle}</Text>
        </>
      )}
      {step === TransferStep.initial && (
        <InputTransferComponent
          recipient={recipient}
          maxAmount={maxAmount}
          currencyCode={currencyCode}
          onSubmit={(details) => {
            setStep(TransferStep.review);
            setTransferDetails(details);
          }}
          style={styles.inputTransferComponentStyle}
        />
      )}
      {step === TransferStep.review && transferDetails && (
        <ReviewTransferComponent
          transferDetail={transferDetails}
          userAccountId={userAccountId}
          style={styles.reviewTransferComponentStyle}
        />
      )}
      {step === TransferStep.authorize && transferDetails && (
        <AuthorizeTransferComponent style={styles.authorizeTransferComponentStyle} />
      )}
      {step === TransferStep.status && transferDetails && (
        <TransferStatusComponent
          transferDetails={transferDetails}
          isFromContact={isFromContact ?? false}
          goBack={onDone}
          onChangedStatus={onChangedStatus}
          companyIcon={companyIcon}
          style={styles.transferStatusComponentStyle}
          transactionDateFormat={transactionDateFormat}
        />
      )}
    </View>
  );
});

export default TransferComponent;
