import React, { ReactNode, useEffect } from 'react';
import {
  Dimensions,
  Platform,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import useMergeStyles from './styles';
import Modal from 'react-native-modal';
import { Button } from 'react-native-theme-component';
import { InformationIcon } from '../../assets/icons';

const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT');

export type AlertComponentProps = {
  style?: AlertComponentStyles;
  isVisible?: boolean;
  children?: ReactNode;
  message?: string;
  title: string;
  cancelTitle?: string; // true if you wanna show cancel title
  confirmTitle?: string; // default is OK,
  onConfirmed?: () => void;
  onClose?: () => void;
  onCancel?: () => void;
  autoClose?: boolean;
  durationToClose?: number;
  backdropOpacity?: number;
  centerHeader?: ReactNode;
  centerIcon?: ReactNode;
};

export type AlertComponentStyles = {
  modalStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  centerHeaderContainerStyle?: StyleProp<ViewStyle>;
  actionContainerStyle?: StyleProp<ViewStyle>;
  buttonSpacerStyle?: StyleProp<ViewStyle>;
  cancelButtonContainerStyle?: StyleProp<ViewStyle>;
  cancelLabelStyle?: StyleProp<TextStyle>;
  messageStyle?: StyleProp<TextStyle>;
};
const _animationDuration = 500;

const AlertComponent = ({
  style,
  isVisible,
  onCancel,
  onClose,
  onConfirmed,
  autoClose,
  durationToClose,
  backdropOpacity,
  confirmTitle,
  cancelTitle,
  children,
  title,
  centerHeader,
  centerIcon,
  message,
}: AlertComponentProps) => {
  const styles: AlertComponentStyles = useMergeStyles(style);

  useEffect(() => {
    if (isVisible && autoClose) {
      setTimeout(() => {
        onClose?.();
      }, durationToClose ?? 0 + _animationDuration);
    }
  }, [isVisible]);

  return (
    <Modal
      deviceHeight={deviceHeight}
      backdropTransitionInTiming={250}
      backdropTransitionOutTiming={250}
      hideModalContentWhileAnimating
      useNativeDriverForBackdrop
      useNativeDriver
      animationIn={'fadeIn'}
      animationOut="fadeOut"
      style={styles.modalStyle}
      backdropOpacity={backdropOpacity ?? 0.4}
      statusBarTranslucent
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      isVisible={isVisible}
    >
      <View style={styles.containerStyle}>
        <View style={styles.centerHeaderContainerStyle}>
          {centerHeader ?? centerIcon ?? <InformationIcon size={50} color="#FBC02D" />}
        </View>
        <Text style={styles.titleStyle}>{title}</Text>
        <Text style={styles.messageStyle}>{message}</Text>
        {children}
        <View style={styles.actionContainerStyle}>
          <Button onPress={onConfirmed} label={confirmTitle ?? 'OK'} />
          {cancelTitle && <View style={styles.buttonSpacerStyle} />}
          {cancelTitle && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cancelButtonContainerStyle}
              onPress={onCancel}
            >
              <Text style={styles.cancelLabelStyle}>{cancelTitle}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AlertComponent;
