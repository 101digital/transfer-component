import { EBank } from '../../../../type';
import React, { ReactNode, useContext } from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import useMergeStyles from './styles';
import { ArrowRightIcon } from '../../../../assets/icons';
import { ThemeContext } from 'react-native-theme-component';

export type ItemEBankComponentProps = {
  eBank: EBank;
  arrowRightIcon?: (isActive: boolean) => ReactNode;
  style?: ItemEBankComponentStyles;
  onPressed: () => void;
};

export type ItemEBankComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  avatarContainerStyle?: StyleProp<ViewStyle>;
  bankNameStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  avatarNameTextStyle?: StyleProp<TextStyle>;
  durationTextStyle?: StyleProp<TextStyle>;
  unavailableTextStyle?: StyleProp<TextStyle>;
};

const ItemEBankComponent = ({
  style,
  eBank,
  arrowRightIcon,
  onPressed,
}: ItemEBankComponentProps) => {
  const styles: ItemEBankComponentStyles = useMergeStyles(style);
  const { i18n } = useContext(ThemeContext);

  const _defaultProvider = eBank.paymentProviders.find((p) => p.isDefault && p.isActive);
  const _isActive = _defaultProvider !== undefined;
  const _avatarColor = _isActive ? '#FF9800' : 'gray';
  const _avatarNameColor = _isActive ? '#5E0CBC' : '#ffffff';

  const getShortName = () => {
    const splitNames = eBank.name.split(' ');
    if (splitNames.length === 1) {
      return splitNames[0].charAt(0).toUpperCase();
    }
    return `${splitNames[0].charAt(0)}${splitNames[1].charAt(0)}`.toUpperCase();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={!_isActive}
      onPress={onPressed}
      style={styles.containerStyle}
    >
      <View style={[styles.avatarContainerStyle, { backgroundColor: _avatarColor }]}>
        <Text style={[styles.avatarNameTextStyle, { color: _avatarNameColor }]}>
          {getShortName()}
        </Text>
      </View>
      <View style={styles.contentContainerStyle}>
        <Text style={styles.bankNameStyle} numberOfLines={1}>
          {eBank.name}
        </Text>
        {_isActive ? (
          <Text style={styles.durationTextStyle}>{_defaultProvider.description}</Text>
        ) : (
          <Text style={styles.unavailableTextStyle}>
            {i18n?.t('select_ewallet_component.msg_bank_unavailable') ??
              'Bank is currently not available'}
          </Text>
        )}
      </View>
      {arrowRightIcon?.(_isActive) ?? (
        <ArrowRightIcon size={12} color={_isActive ? '#FF9800' : '#BAB7BB'} />
      )}
    </TouchableOpacity>
  );
};

export default ItemEBankComponent;
