import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { SelectMethodComponentStyles } from '.';

const useMergeStyles = (style?: SelectMethodComponentStyles): SelectMethodComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: SelectMethodComponentStyles = StyleSheet.create({
    labelTextStyle: {
      fontSize: 12,
      lineHeight: 21,
      fontFamily: fonts.medium,
      color: colors.primaryTextColor,
      marginBottom: 14,
      marginTop: 20,
    },
    itemContainerStyle: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      paddingVertical: 16,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemContentContainerStyle: {
      flex: 1,
    },
    itemDescriptionStyle: {
      fontFamily: fonts.medium,
      fontSize: 12,
      lineHeight: 21,
      color: colors.primaryTextColor,
    },
    itemFeeStyle: {
      color: colors.primaryColor,
    },
    radioContainerStyle: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: '#14BDEB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioInnerContainerStyle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#14BDEB',
    },
    itemSeparatorStyle: {
      height: 20,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
