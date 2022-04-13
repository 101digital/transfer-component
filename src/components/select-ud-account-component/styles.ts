import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { SelectUDAccountComponentStyles } from '.';

const useMergeStyles = (style?: SelectUDAccountComponentStyles): SelectUDAccountComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: SelectUDAccountComponentStyles = StyleSheet.create({
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
    newReceiptButtonStyle: {
      backgroundColor: '#ffffff',
      marginTop: 40,
      borderRadius: 8,
      shadowColor: 'grey',
      shadowOpacity: 0.2,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowRadius: 1,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    newReceiptLabelStyle: {
      fontSize: 12,
      fontFamily: fonts.medium,
      color: colors.primaryTextColor,
      lineHeight: 21,
      marginLeft: 16,
    },
    recentContactContainerStyle: {
      backgroundColor: '#ffffff',
      marginTop: 16,
      borderRadius: 8,
      shadowColor: 'grey',
      shadowOpacity: 0.2,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowRadius: 1,
      elevation: 2,
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    recentContactHeaderContainerStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
    },
    recentContactTitleStyle: {
      fontFamily: fonts.bold,
      fontSize: 16,
      lineHeight: 24,
      color: '#1D1C1D',
    },
    viewAllTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 16,
      color: '#FF9800',
      textDecorationLine: 'underline',
    },
    loadingContainerStyle: {
      paddingVertical: 20,
    },
    emptyContactTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      color: '#7F7B82',
      textAlign: 'center',
      paddingBottom: 39,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
