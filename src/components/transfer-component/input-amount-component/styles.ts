import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { InputAmountComponentStyles } from '.';

const useMergeStyles = (style?: InputAmountComponentStyles): InputAmountComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: InputAmountComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      backgroundColor: colors.appBarBackgroundColor,
    },
    contentContainerStyle: {
      marginHorizontal: 24,
    },
    labelTextStyle: {
      fontSize: 12,
      lineHeight: 21,
      fontFamily: fonts.medium,
      color: colors.primaryTextColor,
      marginBottom: 3,
      marginTop: 20,
    },
    footerContainerStyle: {
      padding: 24,
      backgroundColor: 'rgba(246, 250, 255, 0.8)',
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
