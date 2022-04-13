import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { ReceiverComponentStyles } from '.';

const useMergeStyles = (style?: ReceiverComponentStyles): ReceiverComponentStyles => {
  const { fonts } = useContext(ThemeContext);

  const defaultStyles: ReceiverComponentStyles = StyleSheet.create({
    containerStyle: {
      height: 110,
      backgroundColor: '#8E55D0',
      borderRadius: 8,
      marginTop: 4,
      paddingVertical: 18,
      paddingHorizontal: 20,
    },
    labelContainerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftLabelStyle: {
      fontFamily: fonts.medium,
      fontSize: 12,
      lineHeight: 21,
      color: '#ffffff',
    },
    rightLabelStyle: {
      fontFamily: fonts.bold,
      fontSize: 14,
      lineHeight: 16,
      color: '#ffffff',
      textDecorationLine: 'underline',
    },
    contentContainerStyle: {
      flexDirection: 'row',
      marginTop: 10,
      alignItems: 'center',
    },
    avatarContainerStyle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFB74C',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarTextStyle: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: '#5E0CBC',
    },
    nameStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      color: '#ffffff',
    },
    accountNumberStyle: {
      fontFamily: fonts.medium,
      fontSize: 10,
      lineHeight: 18,
      color: '#ffffff',
    },
    accountContainerStyle: {
      flex: 1,
      marginLeft: 16,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
