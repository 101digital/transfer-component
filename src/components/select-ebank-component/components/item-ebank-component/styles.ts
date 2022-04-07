import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { ItemEBankComponentStyles } from '.';

const useMergeStyles = (style?: ItemEBankComponentStyles): ItemEBankComponentStyles => {
  const { fonts } = useContext(ThemeContext);

  const defaultStyles: ItemEBankComponentStyles = StyleSheet.create({
    containerStyle: {
      flexDirection: 'row',
      marginVertical: 12.5,
      alignItems: 'center',
    },
    avatarContainerStyle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bankNameStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      color: 'black',
    },
    contentContainerStyle: {
      flex: 1,
      marginHorizontal: 16,
    },
    avatarNameTextStyle: {
      fontFamily: fonts.bold,
      fontSize: 16,
    },
    durationTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 10,
      color: '#7F7B82',
      lineHeight: 18,
    },
    unavailableTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 10,
      color: '#E06D6D',
      lineHeight: 18,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
