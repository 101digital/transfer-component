import React, { useContext } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import useMergeStyles from './styles';

export type ReceiverComponentProps = {
  name: string;
  accountNumber?: string;
  style?: ReceiverComponentStyles;
};

export type ReceiverComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  avatarContainerStyle?: StyleProp<ViewStyle>;
  avatarTextStyle?: StyleProp<TextStyle>;
  accountContainerStyle?: StyleProp<ViewStyle>;
  nameStyle?: StyleProp<TextStyle>;
  accountNumberStyle?: StyleProp<TextStyle>;
};

const ReceiverComponent = ({ style, name, accountNumber }: ReceiverComponentProps) => {
  const styles: ReceiverComponentStyles = useMergeStyles(style);
  const { i18n } = useContext(ThemeContext);

  const getShortName = () => {
    const splitNames = name.split(' ');
    if (splitNames.length === 1) {
      return splitNames[0].charAt(0).toUpperCase();
    }
    return `${splitNames[0].charAt(0)}${splitNames[1].charAt(0)}`.toUpperCase();
  };

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.labelStyle}>{i18n?.t('input_amount_component.lbl_to') ?? 'To :'}</Text>
      <View style={styles.contentContainerStyle}>
        <View style={styles.avatarContainerStyle}>
          <Text style={styles.avatarTextStyle}>{getShortName()}</Text>
        </View>
        <View style={styles.accountContainerStyle}>
          <Text numberOfLines={1} style={styles.nameStyle}>
            {name}
          </Text>
          {accountNumber && <Text style={styles.accountNumberStyle}>{accountNumber}</Text>}
        </View>
      </View>
    </View>
  );
};

export default ReceiverComponent;
