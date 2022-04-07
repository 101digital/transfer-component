import { ArrowRightIcon } from '../../../../assets/icons';
import { Recipient } from '../../../../type';
import React, { ReactNode } from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import useMergeStyles from './styles';

export type ContactItemComponentProps = {
  recipient: Recipient;
  arrowRightIcon?: ReactNode;
  onPressed: (recipient: Recipient) => void;
  style?: ContactItemComponentStyles;
};

export type ContactItemComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  avatarContainerStyle?: StyleProp<ViewStyle>;
  avatarNameTextStyle?: StyleProp<TextStyle>;
  accountContainerStyle?: StyleProp<ViewStyle>;
  accountNameStyle?: StyleProp<TextStyle>;
  accountNumberStyle?: StyleProp<TextStyle>;
};

const ContactItemComponent = ({
  recipient,
  onPressed,
  arrowRightIcon,
  style,
}: ContactItemComponentProps) => {
  const styles: ContactItemComponentStyles = useMergeStyles(style);
  const getShortName = () => {
    const splitNames = recipient.displayName.split(' ');
    if (splitNames.length === 1) {
      return splitNames[0].charAt(0).toUpperCase();
    }
    return `${splitNames[0].charAt(0)}${splitNames[1].charAt(0)}`.toUpperCase();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.containerStyle}
      onPress={() => onPressed(recipient)}
    >
      <View style={styles.avatarContainerStyle}>
        <Text style={styles.accountNameStyle}>{getShortName()}</Text>
      </View>
      <View style={styles.accountContainerStyle}>
        <Text style={styles.accountNameStyle}>{recipient.displayName}</Text>
        <Text style={styles.accountNumberStyle}>{recipient.accountNumber}</Text>
      </View>
      {arrowRightIcon ?? <ArrowRightIcon size={12} color={'#FF9800'} />}
    </TouchableOpacity>
  );
};

export default ContactItemComponent;
