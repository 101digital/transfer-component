import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { ContactItemComponentStyles } from '.';

const useMergeStyles = (style?: ContactItemComponentStyles): ContactItemComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: ContactItemComponentStyles = StyleSheet.create({
    containerStyle: {
      flexDirection: 'row',
      paddingVertical: 12,
      alignItems: 'center',
    },
    avatarContainerStyle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFB74C',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarNameTextStyle: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: colors.primaryColor,
    },
    accountContainerStyle: {
      flex: 1,
      marginHorizontal: 16,
    },
    accountNumberStyle: {
      fontFamily: fonts.medium,
      fontSize: 10,
      lineHeight: 18,
      color: '#7F7B82',
    },
    accountNameStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      color: '#000',
    },
    radioContainerStyle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: '#14BDEB',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
    },
    radioInnerContainerStyle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#14BDEB',
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
