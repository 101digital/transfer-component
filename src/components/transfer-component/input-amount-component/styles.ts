import { addAlpha } from './../../../../../../node_modules/react-native-theme-component/src/colors';
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
    },
    contentContainerStyle: {
      marginHorizontal: 24,
      marginBottom: 96,
    },
    labelTextStyle: {
      fontSize: 12,
      lineHeight: 21,
      fontFamily: fonts.medium,
      color: '#ffffff',
      marginBottom: 3,
      marginTop: 20,
    },
    footerContainerStyle: {
      padding: 24,
      backgroundColor: addAlpha(colors.primaryColor!, 0.8),
    },
    countLengthStyle: {
      fontFamily: fonts.medium,
      fontSize: 12,
      lineHeight: 21,
      color: '#ffffff',
      marginTop: 8,
      textAlign: 'right',
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
