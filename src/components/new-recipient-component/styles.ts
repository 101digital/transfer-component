import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { NewRecipientComponentStyles } from '.';

const useMergeStyles = (style?: NewRecipientComponentStyles): NewRecipientComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: NewRecipientComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      paddingHorizontal: 24,
    },
    sendMoneyToLabelStyle: {
      fontFamily: fonts.medium,
      fontSize: 12,
      lineHeight: 21,
      color: colors.primaryTextColor,
      marginTop: 40,
    },
    selectTypeContainerStyle: {
      flexDirection: 'row',
      marginTop: 17,
      marginBottom: 20,
    },
    typeContainerStyle: {
      flex: 1,
      height: 40,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 183, 76, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    typeLabelStyle: {
      fontFamily: fonts.medium,
      color: '#FF9800',
      fontSize: 14,
      lineHeight: 24,
      textAlign: 'center',
    },
    labelTextStyle: {
      fontSize: 12,
      lineHeight: 21,
      fontFamily: fonts.medium,
      color: colors.primaryTextColor,
      marginBottom: 3,
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
    footerContainerStyle: {
      padding: 24,
      backgroundColor: 'rgba(246, 250, 255, 0.8)',
    },
    selectDeviceContactStyle: {
      fontFamily: fonts.bold,
      fontSize: 14,
      lineHeight: 21,
      color: colors.primaryButtonColor,
      textDecorationLine: 'underline',
      textAlign: 'center',
      paddingVertical: 20,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
