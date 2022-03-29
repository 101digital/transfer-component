import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { TransferSuccessComponentStyles } from '.';

const useMergeStyles = (style?: TransferSuccessComponentStyles): TransferSuccessComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);
  const defaultStyles: TransferSuccessComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      backgroundColor: colors.appBarBackgroundColor,
    },
    mainContainerStyle: {
      flex: 1,
      paddingHorizontal: 24,
    },
    headerTextStyle: {
      fontFamily: fonts.bold,
      fontSize: 24,
      lineHeight: 36,
      color: '#2E7D32',
    },
    subHeaderTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      color: '#4E4B50',
      marginTop: 20,
    },
    labelTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 12,
      lineHeight: 21,
      color: '#7F7B82',
    },
    valueTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 12,
      lineHeight: 21,
      color: colors.primaryTextColor,
    },

    addContactButton: {
      height: 45,
      borderWidth: 1,
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      flexDirection: 'row',
    },
    addContactButtonLabel: {
      fontSize: 14,
      fontFamily: fonts.bold,
    },
  });
  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
