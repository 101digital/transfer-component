import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { ProgressingTransferComponentStyles } from '.';

const useMergeStyles = (
  style?: ProgressingTransferComponentStyles
): ProgressingTransferComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);
  const defaultStyles: ProgressingTransferComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      backgroundColor: colors.appBarBackgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    titleTextStyle: {
      fontFamily: fonts.bold,
      fontSize: 24,
      lineHeight: 36,
      color: colors.primaryColor,
      textAlign: 'center',
    },
    messageTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 16,
      lineHeight: 24,
      color: '#7F7B82',
      paddingHorizontal: 24,
      marginTop: 16,
      textAlign: 'center',
    },
    loadingIndicatorStyle: {
      marginTop: 80,
    },
  });

  return defaultsDeep(style, defaultStyles);
};
export default useMergeStyles;
