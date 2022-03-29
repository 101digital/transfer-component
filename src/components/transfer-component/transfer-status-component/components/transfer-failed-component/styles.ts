import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { TransferFailedComponentStyles } from '.';

const useMergeStyles = (style?: TransferFailedComponentStyles): TransferFailedComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);
  const defaultStyles: TransferFailedComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      backgroundColor: colors.primaryColor,
    },
    mainContainerStyle: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleTextStyle: {
      fontFamily: fonts.bold,
      fontSize: 24,
      lineHeight: 36,
      color: '#E06D6D',
      textAlign: 'center',
      marginTop: 47,
      marginBottom: 16,
    },
    messageTextStyle: {
      fontFamily: fonts.bold,
      fontSize: 16,
      lineHeight: 24,
      color: '#ffffff',
      textAlign: 'center',
      paddingHorizontal: 24,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
