import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { ErrorConnectComponentStyles } from '.';

const useMergeStyles = (style?: ErrorConnectComponentStyles): ErrorConnectComponentStyles => {
  const { fonts } = useContext(ThemeContext);

  const defaultStyles: ErrorConnectComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
    },
    contentContainerStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    errorTitleStyle: {
      fontFamily: fonts.bold,
      fontSize: 24,
      lineHeight: 36,
      color: '#E06D6D',
      marginTop: 47,
      marginBottom: 16,
      textAlign: 'center',
    },
    errorMessageStyle: {
      fontFamily: fonts.bold,
      fontSize: 16,
      lineHeight: 24,
      color: '#7F7B82',
      textAlign: 'center',
    },
    swipeActionTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      color: '#7F7B82',
      marginTop: 58,
      marginBottom: 8,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
