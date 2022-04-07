import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { TransferMethodComponentStyles } from '.';

const useMergeStyles = (style?: TransferMethodComponentStyles): TransferMethodComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: TransferMethodComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      paddingHorizontal: 24,
    },
    contentContainerStyle: {
      flex: 1,
      marginTop: 32,
    },
    headerTitleStyle: {
      lineHeight: 36,
      color: colors.primaryColor,
      fontFamily: fonts.bold,
      fontSize: 24,
    },
    headerSubTitleStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      color: colors.secondaryTextColor,
      marginTop: 20,
    },
    buttonContainerStyle: {
      height: 60,
      borderRadius: 8,
      backgroundColor: 'white',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      shadowColor: '#000000',
      alignItems: 'center',
      paddingHorizontal: 20,
      flexDirection: 'row',
    },
    buttonLabelStyle: {
      flex: 1,
      fontFamily: fonts.medium,
      fontSize: 12,
      color: '#000000',
    },
    disabledTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 10,
      color: '#E06D6D',
      lineHeight: 18,
      marginTop: 8,
    },
    disableButtonContainerStyle: {
      height: 60,
      borderRadius: 8,
      backgroundColor: '#EAEAEB',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      shadowColor: '#000000',
      alignItems: 'center',
      paddingHorizontal: 20,
      flexDirection: 'row',
    },
    disableButtonLabelStyle: {
      flex: 1,
      fontFamily: fonts.medium,
      fontSize: 12,
      color: '#BAB7BB',
    },
    itemSeparatorStyle: {
      height: 16,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
