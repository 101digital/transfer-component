import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { SelectEBankComponentStyles } from '.';

const useMergeStyles = (style?: SelectEBankComponentStyles): SelectEBankComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: SelectEBankComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      paddingHorizontal: 24,
    },
    headerTitleStyle: {
      lineHeight: 36,
      color: colors.primaryColor,
      fontFamily: fonts.bold,
      fontSize: 24,
    },
    subTitleStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      color: colors.secondaryTextColor,
      marginTop: 20,
    },
    emptyResultTextStyle: {
      fontFamily: fonts.bold,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
      marginTop: 79,
    },
    eBankListStyle: {
      marginTop: 8,
    },
    sectionTextStyle: {
      fontFamily: fonts.bold,
      fontSize: 12,
      lineHeight: 24,
      color: '#7F7B82',
      marginTop: 12,
      marginBottom: 8,
    },
    loadingIndicatorStyle: {
      marginVertical: 20,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
