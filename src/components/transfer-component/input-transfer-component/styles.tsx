import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { addAlpha, ThemeContext } from 'react-native-theme-component';
import { InputTransferComponentStyles } from '.';

const useMergeStyles = (style?: InputTransferComponentStyles): InputTransferComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: InputTransferComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
    },
    footerContainerStyle: {
      padding: 24,
      backgroundColor: addAlpha(colors.appBarBackgroundColor!, 0.8),
    },
    contentContainerStyle: {
      flex: 1,
      marginBottom: 96,
      paddingHorizontal: 24,
    },
    labelTextStyle: {
      fontSize: 12,
      lineHeight: 21,
      fontFamily: fonts.medium,
      color: colors.primaryTextColor,
      marginBottom: 3,
      marginTop: 20,
    },
    suffixContainerStyle: {
      paddingHorizontal: 12,
    },
    countLengthStyle: {
      fontFamily: fonts.medium,
      fontSize: 12,
      lineHeight: 21,
      color: '#000000',
      marginTop: 8,
      textAlign: 'right',
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
