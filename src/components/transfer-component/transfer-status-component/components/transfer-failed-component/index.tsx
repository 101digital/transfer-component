import React, { useContext } from 'react';
import { SafeAreaView, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Button, ThemeContext } from 'react-native-theme-component';
import { InfomationIcon } from '../../../../../assets/icons';
import useMergeStyles from './styles';

export type TransferFailedComponentProps = {
  style?: TransferFailedComponentStyles;
  onBack: () => void;
};

export type TransferFailedComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  titleTextStyle?: StyleProp<TextStyle>;
  messageTextStyle?: StyleProp<TextStyle>;
  referenceContainerStyle?: StyleProp<ViewStyle>;
  referenceTextStyle?: StyleProp<TextStyle>;
};

const TransferFailedComponent = ({ style, onBack }: TransferFailedComponentProps) => {
  const styles: TransferFailedComponentStyles = useMergeStyles(style);
  const { i18n } = useContext(ThemeContext);

  return (
    <SafeAreaView style={styles.containerStyle}>
      <View style={styles.mainContainerStyle}>
        <InfomationIcon size={80} />
        <Text style={styles.titleTextStyle}>
          {i18n?.t('transfer_status_component.lbl_transfer_unsuccessful') ??
            'Transfer Request\nUnsuccessful!'}
        </Text>
        <Text style={styles.messageTextStyle}>
          {i18n?.t('transfer_status_component.msg_transfer_unsuccessful') ??
            'Your money has been returned to your wallet. Please try again at a later time.'}
        </Text>
      </View>
      <Button
        onPress={onBack}
        label={i18n?.t('transfer_status_component.btn_back_to_top') ?? 'Back'}
        style={{
          primaryContainerStyle: {
            marginHorizontal: 24,
          },
        }}
      />
    </SafeAreaView>
  );
};

export default TransferFailedComponent;
