import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { TransferComponentStyles } from '.';

const useMergeStyles = (style?: TransferComponentStyles): TransferComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: TransferComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      backgroundColor: colors.appBarBackgroundColor,
    },
    headerTitleStyle: {
      lineHeight: 36,
      color: colors.primaryColor,
      fontFamily: fonts.bold,
      fontSize: 24,
      paddingHorizontal: 24,
    },
    headerSubTitleStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      color: colors.secondaryTextColor,
      marginTop: 20,
      paddingHorizontal: 24,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
