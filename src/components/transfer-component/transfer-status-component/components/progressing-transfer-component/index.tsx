import React, { useContext } from 'react';
import { ActivityIndicator, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import useMergeStyles from './styles';

export type ProgressingTransferComponentProps = {
  style?: ProgressingTransferComponentStyles;
};

export type ProgressingTransferComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  titleTextStyle?: StyleProp<TextStyle>;
  messageTextStyle?: StyleProp<TextStyle>;
  loadingIndicatorStyle?: StyleProp<ViewStyle>;
};

const ProgressingTransferComponent = ({ style }: ProgressingTransferComponentProps) => {
  const { colors, i18n } = useContext(ThemeContext);
  const styles: ProgressingTransferComponentStyles = useMergeStyles(style);

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.titleTextStyle}>
        {i18n?.t('transfer_status_component.lbl_hang_on') ?? 'Hang on for a moment'}
      </Text>
      <Text style={styles.messageTextStyle}>
        {i18n?.t('transfer_status_component.msg_hang_on_transaction') ??
          "We're currently setting up your transaction."}
      </Text>
      <ActivityIndicator
        size={'large'}
        style={styles.loadingIndicatorStyle}
        color={colors.primaryColor}
      />
    </View>
  );
};

export default ProgressingTransferComponent;
