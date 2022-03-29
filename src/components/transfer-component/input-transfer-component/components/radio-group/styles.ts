import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { RadioGroupComponentStyles } from '.';

const useMergeStyles = (style?: RadioGroupComponentStyles): RadioGroupComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: RadioGroupComponentStyles = StyleSheet.create({
    containerStyle: {
      marginVertical: 15,
    },
    itemContainerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    titleTextStyle: {
      fontFamily: fonts.medium,
      color: colors.primaryTextColor,
      lineHeight: 21,
      fontSize: 12,
      flex: 1,
    },
    outlineContainerStyle: {
      width: 20,
      height: 20,
      backgroundColor: '#EAEAEB',
      borderRadius: 10,
    },
    activeOutlineStyle: {
      width: 20,
      height: 20,
      borderWidth: 5,
      borderRadius: 10,
      borderColor: colors.secondaryColor,
    },
    innerContainerStyle: {
      width: 26,
      height: 26,
      borderWidth: 1,
      backgroundColor: '#ffffff',
      borderColor: colors.secondaryColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 13,
    },
    activeInnerStyle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.secondaryColor,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
