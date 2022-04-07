import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Button, CountdownTimer, OTPField, ThemeContext } from 'react-native-theme-component';
import { CountDownTimerRef } from 'react-native-theme-component/src/countdown-timer';
import { OTPFieldStyles } from 'react-native-theme-component/src/otp-field';
import { TransferContext } from '../../../context/transfer-context';
import useMergeStyles from './styles';

export type AuthorizeTransferComponentProps = {
  style?: AuthorizeTransferComponentStyles;
};

export type AuthorizeTransferComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  countdownContainerStyle?: StyleProp<ViewStyle>;
  notReceivedCodeTextStyle?: StyleProp<TextStyle>;
  sendAnotherTextStyle?: StyleProp<TextStyle>;
  durationTextStyle?: StyleProp<TextStyle>;
  otpFieldStyle?: OTPFieldStyles;
};

const AuthorizeTransferComponent = ({ style }: AuthorizeTransferComponentProps) => {
  const styles: AuthorizeTransferComponentStyles = useMergeStyles(style);
  const countdownRef = useRef<CountDownTimerRef>();
  const { authorizeTransfer, clearTransferResponse, resendOtp, isSentOtp } =
    useContext(TransferContext);
  const [value, setValue] = useState('');

  const { colors, i18n } = useContext(ThemeContext);

  useEffect(() => {
    if (isSentOtp) {
      countdownRef.current?.restart();
    }
  }, [isSentOtp]);

  useEffect(() => {
    return () => {
      clearTransferResponse();
    };
  }, []);

  return (
    <View style={styles.containerStyle}>
      <OTPField style={styles.otpFieldStyle} cellCount={6} onChanged={setValue} />
      <View style={styles.countdownContainerStyle}>
        <Text style={styles.notReceivedCodeTextStyle}>
          {i18n?.t('authorize_transfer_component.lbl_didnt_receive_otp') ??
            "Didn't receive a code? "}
        </Text>
        <CountdownTimer
          ref={countdownRef}
          duration={60}
          formatTime={(sec) =>
            i18n
              ?.t('authorize_transfer_component.lbl_duration_format')
              ?.replace('%s', sec.toString()) ?? `Send another (in ${sec} sec)`
          }
          endText={i18n?.t('authorize_transfer_component.btn_send_another') ?? 'Send another'}
          style={{
            endTextStyle: styles.sendAnotherTextStyle,
            runningTextStyle: styles.durationTextStyle,
          }}
          onResend={() => resendOtp()}
        />
      </View>
      <Button
        label={i18n?.t('authorize_transfer_component.btn_continue') ?? 'Continue'}
        onPress={() => {
          authorizeTransfer(value);
        }}
        disabled={value.length < 6}
        disableColor={colors.secondaryButtonColor}
        style={{
          primaryContainerStyle: {
            margin: 24,
          },
        }}
      />
    </View>
  );
};

export default AuthorizeTransferComponent;
