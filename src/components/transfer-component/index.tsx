import { isEmpty } from 'lodash';
import React, {
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
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
import { showMessage, ThemeContext, useCurrencyFormat } from 'react-native-theme-component';
import { ArrowBack } from '../../assets/icons';
import { TransferContext } from '../../context/transfer-context';
import { EBank, Recipient, TransferDetails, TransferStatus, Wallet } from '../../type';
import AlertComponent, { AlertComponentStyles } from '../alert-component';
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
  TransferStatusComponentRef,
  TransferStatusComponentStyles,
} from './transfer-status-component';

export type TransferComponentProps = {
  recipient?: Recipient;
  eBank?: EBank;
  companyIcon?: ReactNode;
  isFromContact?: boolean;
  wallet?: Wallet;
  onDone: () => void;
  onCancel: () => void;
  backIcon?: (step: TransferStep) => ReactNode;
  transactionDateFormat?: string;
  themeColors?: {
    dark: {
      backgroundColor: string;
      textColor: string;
    };
    light: {
      backgroundColor: string;
      textColor: string;
    };
  };
  style?: TransferComponentStyles;
  onChangedStep: (step: TransferStep) => void;
  onChangedStatus: (status: TransferStatus) => void;
  errorInitTransferModal?: ReactNode;
  cancelTransferModal?: (isVisible: boolean, setVisible: (isVisible: boolean) => void) => ReactNode;
};

export type TransferComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  headerTitleStyle?: StyleProp<TextStyle>;
  headerSubTitleStyle?: StyleProp<TextStyle>;
  headerContainerStyle?: StyleProp<ViewStyle>;
  leftButtonStyle?: StyleProp<ViewStyle>;
  rightButtonStyle?: StyleProp<ViewStyle>;
  rightButtonTitleStyle?: StyleProp<TextStyle>;
  balanceTitleStyle?: StyleProp<TextStyle>;
  balanceValueStyle?: StyleProp<TextStyle>;
  inputTransferComponentStyle?: InputTransferComponentStyles;
  reviewTransferComponentStyle?: ReviewTransferComponentStyles;
  authorizeTransferComponentStyle?: AuthorizeTransferComponentStyles;
  transferStatusComponentStyle?: TransferStatusComponentStyles;
  inputAmountComponentStyle?: InputAmountComponentStyles;
  alertComponentStyle?: AlertComponentStyles;
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
    wallet,
    onDone,
    onChangedStatus,
    companyIcon,
    transactionDateFormat,
    eBank,
    onCancel,
    backIcon,
    themeColors,
    errorInitTransferModal,
    cancelTransferModal,
  } = props;
  const styles: TransferComponentStyles = useMergeStyles(style);
  const [step, setStep] = useState<TransferStep>(TransferStep.inputAmount);
  const [status, setStatus] = useState<TransferStatus>(TransferStatus.progressing);
  const {
    transferResponse,
    isAuthorizingTransfer,
    paymentMethod,
    clearErrors,
    errorInitialTransfer,
    clearTransferResponse,
  } = useContext(TransferContext);
  const [transferDetails, setTransferDetails] = useState<TransferDetails | undefined>(undefined);
  const { i18n, colors } = useContext(ThemeContext);
  const [isShowCancel, setShowCancel] = useState(false);
  const shareTransferRef = useRef<TransferStatusComponentRef>();

  const _darkColor = themeColors?.dark;
  const _lightColor = themeColors?.light;

  useEffect(() => {
    return () => {
      setStep(TransferStep.inputAmount);
      setTransferDetails(undefined);
      setStatus(TransferStatus.progressing);
      clearErrors();
      clearTransferResponse();
    };
  }, []);

  useEffect(() => {
    if (!wallet) {
      showMessage({
        message:
          i18n?.t('input_amount_component.msg_not_found_wallet') ?? 'Not found wallet details',
        backgroundColor: '#ff0000',
      });
      onCancel();
    }
  }, [wallet]);

  useEffect(() => {
    if (recipient) {
      if (isEmpty(recipient.accountNumber) || isEmpty(recipient.paymentReference)) {
        showMessage({
          message:
            i18n?.t('input_amount_component.msg_recipient_invalid') ??
            'Recipient is invalid, please check again',
          backgroundColor: '#ff0000',
        });
        onCancel();
      }
    }
  }, [recipient]);

  useEffect(() => {
    const _isFromUD = recipient !== undefined;
    setTransferDetails({
      ...transferDetails,
      charge: _isFromUD ? paymentMethod?.Charges[0] : undefined,
      transferType: _isFromUD ? 'UD' : 'OTHERS',
      accountId: _isFromUD ? recipient.paymentReference : undefined,
      accountName: _isFromUD ? recipient.displayName : undefined,
      accountNumber: _isFromUD ? recipient.accountNumber : undefined,
    });
  }, [recipient, eBank]);

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
      if (transferDetails?.transferType === 'UD') {
        setStep(TransferStep.inputAmount);
      } else {
        setStep(TransferStep.initial);
      }
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
          title:
            transferDetails?.provider?.name === 'Pesonet'
              ? i18n?.t('input_transfer_component.lbl_header_title_pesonet') ??
                'Send now, receive later'
              : i18n?.t('input_transfer_component.lbl_header_title_instapay') ?? 'Send now to',
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

  const _backgroundColor =
    step === TransferStep.inputAmount
      ? _darkColor?.backgroundColor ?? colors.primaryColor
      : _lightColor?.backgroundColor ?? colors.appBarBackgroundColor;
  const _textColor =
    step === TransferStep.inputAmount
      ? _darkColor?.textColor ?? '#ffffff'
      : _lightColor?.textColor ?? colors.primaryColor;

  if (!wallet) {
    return (
      <SafeAreaView>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.leftButtonStyle}
          onPress={() => {
            backToPrevious();
          }}
        >
          {backIcon?.(step) ?? <ArrowBack color={_textColor} />}
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <>
      <View style={[styles.containerStyle, { backgroundColor: _backgroundColor }]}>
        <SafeAreaView style={styles.headerContainerStyle}>
          {step !== TransferStep.status && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.leftButtonStyle}
              onPress={() => {
                backToPrevious();
              }}
            >
              {backIcon?.(step) ?? <ArrowBack color={_textColor} />}
            </TouchableOpacity>
          )}
          <View style={innerStyles.spacer} />
          {step === TransferStep.review && (
            <TouchableOpacity
              onPress={() => setShowCancel(true)}
              activeOpacity={0.8}
              style={styles.rightButtonStyle}
            >
              <Text style={styles.rightButtonTitleStyle}>
                {i18n?.t('review_transfer_component.btn_cancel') ?? 'Cancel'}
              </Text>
            </TouchableOpacity>
          )}
          {step === TransferStep.inputAmount && (
            <Text style={styles.balanceTitleStyle}>
              {i18n?.t('input_amount_component.lbl_balance') ?? 'My Balance:'}
              {'\n'}
              <Text style={styles.balanceValueStyle}>
                {useCurrencyFormat(wallet.availableBalance, wallet.currencyCode)}
              </Text>
            </Text>
          )}
          {step === TransferStep.status && status === TransferStatus.success && (
            <TouchableOpacity
              onPress={() => shareTransferRef?.current?.share()}
              activeOpacity={0.8}
              style={styles.rightButtonStyle}
            >
              <Text style={styles.rightButtonTitleStyle}>
                {i18n?.t('transfer_status_component.btn_share') ?? 'Share'}
              </Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
        {headerInformation && (
          <>
            <Text style={[styles.headerTitleStyle, { color: _textColor }]}>
              {headerInformation.title}
            </Text>
            {headerInformation.subTitle && (
              <Text style={styles.headerSubTitleStyle}>{headerInformation.subTitle}</Text>
            )}
          </>
        )}
        {step === TransferStep.inputAmount && (
          <InputAmountComponent
            availableBalance={wallet.availableBalance}
            onEdit={onCancel}
            recipient={recipient}
            transferDetails={transferDetails}
            eBank={eBank}
            currencyCode={wallet.currencyCode}
            onNext={(amount, charge, note, provider) => {
              setTransferDetails({
                ...transferDetails,
                amount,
                note,
                currencyCode: wallet.currencyCode,
                charge,
                bankName: eBank?.name,
                provider,
              });
              if (transferDetails?.transferType === 'OTHERS') {
                setStep(TransferStep.initial);
              } else {
                setStep(TransferStep.review);
              }
            }}
            style={styles.inputAmountComponentStyle}
          />
        )}
        {step === TransferStep.initial && (
          <InputTransferComponent
            transferDetails={transferDetails}
            recipient={recipient}
            currencyCode={wallet.currencyCode}
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
            userAccountId={wallet.bankAccount.accountId}
            style={styles.reviewTransferComponentStyle}
            onEditAmount={() => setStep(TransferStep.inputAmount)}
            onEditReceiver={onCancel}
          />
        )}
        {step === TransferStep.authorize && transferDetails && (
          <AuthorizeTransferComponent style={styles.authorizeTransferComponentStyle} />
        )}
        {step === TransferStep.status && transferDetails && (
          <TransferStatusComponent
            ref={shareTransferRef}
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
      {cancelTransferModal?.(isShowCancel, setShowCancel) ?? (
        <AlertComponent
          isVisible={isShowCancel}
          title={i18n?.t('review_transfer_component.lbl_cancel_dialog_title') ?? 'Cancel Transfer'}
          onConfirmed={() => {
            setShowCancel(false);
            onCancel();
          }}
          onClose={() => setShowCancel(false)}
          message={
            i18n?.t('review_transfer_component.msg_cancel_dialog_message') ??
            'Do you wish to cancel this payment?\nAll details will be discarded if you cancel this transaction.'
          }
          confirmTitle={
            i18n?.t('review_transfer_component.btn_cancel_transfer') ?? 'Yes, cancel transfer'
          }
          cancelTitle={
            i18n?.t('review_transfer_component.btn_continue_transfer') ?? 'No, continue transfer'
          }
          onCancel={() => setShowCancel(false)}
          style={styles.alertComponentStyle}
        />
      )}
      {errorInitTransferModal ?? (
        <AlertComponent
          isVisible={!isEmpty(errorInitialTransfer?.toString())}
          title={
            i18n?.t('review_transfer_component.lbl_something_went_wrong') ?? 'Something went wrong'
          }
          onConfirmed={clearErrors}
          onClose={clearErrors}
          message={errorInitialTransfer?.message.toString()}
          style={styles.alertComponentStyle}
        />
      )}
    </>
  );
});

const innerStyles = StyleSheet.create({
  spacer: {
    flex: 1,
  },
});

export default TransferComponent;
