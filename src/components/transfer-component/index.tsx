import React, {
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  SafeAreaView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { ArrowBack } from '../../assets/icons';
import { TransferContext } from '../../context/transfer-context';
import { EBank, Recipient, TransferDetails, TransferStatus } from '../../type';
import AuthorizeTransferComponent, {
  AuthorizeTransferComponentStyles,
} from './authorize-transfer-component';
import InputAmountComponent, { InputAmountComponentStyles } from './input-amount-component';
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
  eBank?: EBank;
  companyIcon?: ReactNode;
  isFromContact?: boolean;
  userAccountId: string;
  onDone: () => void;
  onCancel: () => void;
  onShare?: () => void;
  backIcon?: (step: TransferStep) => ReactNode;
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
  headerContainerStyle?: StyleProp<ViewStyle>;
  leftButtonStyle?: StyleProp<ViewStyle>;
  rightButtonStyle?: StyleProp<ViewStyle>;
  rightButtonTitleStyle?: StyleProp<TextStyle>;
  inputTransferComponentStyle?: InputTransferComponentStyles;
  reviewTransferComponentStyle?: ReviewTransferComponentStyles;
  authorizeTransferComponentStyle?: AuthorizeTransferComponentStyles;
  transferStatusComponentStyle?: TransferStatusComponentStyles;
  inputAmountComponentStyle?: InputAmountComponentStyles;
};

export enum TransferStep {
  inputAmount,
  initial,
  review,
  authorize,
  status,
}

export type TransferComponentRef = {
  changeStep: (step: TransferStep) => void;
  backToPrevious: () => void;
};

const TransferComponent = forwardRef((props: TransferComponentProps, ref) => {
  const {
    style,
    onChangedStep,
    recipient,
    isFromContact,
    userAccountId,
    onDone,
    onChangedStatus,
    currencyCode,
    companyIcon,
    transactionDateFormat,
    eBank,
    onCancel,
    onShare,
    backIcon,
  } = props;
  const styles: TransferComponentStyles = useMergeStyles(style);
  const [step, setStep] = useState<TransferStep>(TransferStep.inputAmount);
  const [status, setStatus] = useState<TransferStatus>(TransferStatus.progressing);
  const { transferResponse, isAuthorizingTransfer } = useContext(TransferContext);
  const [transferDetails, setTransferDetails] = useState<TransferDetails | undefined>(undefined);
  const { i18n } = useContext(ThemeContext);

  useEffect(() => {
    return () => {
      setStep(TransferStep.inputAmount);
      setTransferDetails(undefined);
      setStatus(TransferStatus.progressing);
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
      backToPrevious,
    })
  );

  const changeStep = (_step: TransferStep) => {
    setStep(_step);
  };

  const backToPrevious = () => {
    if (step === TransferStep.inputAmount) {
      onCancel();
    } else if (step === TransferStep.initial) {
      setStep(TransferStep.inputAmount);
    } else if (step === TransferStep.review) {
      setStep(TransferStep.initial);
    } else if (step === TransferStep.authorize) {
      setStep(TransferStep.review);
    }
  };

  const getStepHeaderInformation = () => {
    switch (step) {
      case TransferStep.inputAmount:
        return {
          title: i18n?.t('input_amount_component.lbl_header_title') ?? 'Enter amount to send',
          subTitle: undefined,
        };
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
      <SafeAreaView style={styles.headerContainerStyle}>
        {step !== TransferStep.status && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.leftButtonStyle}
            onPress={() => {
              backToPrevious();
            }}
          >
            {backIcon?.(step) ?? <ArrowBack color='#5E0CBC' />}
          </TouchableOpacity>
        )}
        <View style={innerStyles.spacer} />
        {step === TransferStep.status && status === TransferStatus.success && (
          <TouchableOpacity onPress={onShare} activeOpacity={0.8} style={styles.rightButtonStyle}>
            <Text style={styles.rightButtonTitleStyle}>
              {i18n?.t('transfer_status_component.btn_share') ?? 'Share'}
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
      {headerInformation && (
        <>
          <Text style={styles.headerTitleStyle}>{headerInformation.title}</Text>
          {headerInformation.subTitle && (
            <Text style={styles.headerSubTitleStyle}>{headerInformation.subTitle}</Text>
          )}
        </>
      )}
      {step === TransferStep.inputAmount && (
        <InputAmountComponent
          recipient={recipient}
          transferDetails={transferDetails}
          eBank={eBank}
          currencyCode={currencyCode}
          onNext={(amount, charge, note, provider) => {
            setTransferDetails({
              ...transferDetails,
              amount,
              note,
              currencyCode,
              charge,
              bankName: eBank?.name,
              provider,
            });
            setStep(TransferStep.initial);
          }}
          style={styles.inputAmountComponentStyle}
        />
      )}
      {step === TransferStep.initial && (
        <InputTransferComponent
          transferDetails={transferDetails}
          recipient={recipient}
          currencyCode={currencyCode}
          onSubmit={(details) => {
            setStep(TransferStep.review);
            setTransferDetails({ ...transferDetails, ...details });
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
          onChangedStatus={(value) => {
            setStatus(value);
            onChangedStatus(value);
          }}
          companyIcon={companyIcon}
          style={styles.transferStatusComponentStyle}
          transactionDateFormat={transactionDateFormat}
        />
      )}
    </View>
  );
});

const innerStyles = StyleSheet.create({
  spacer: {
    flex: 1,
  },
});

export default TransferComponent;
