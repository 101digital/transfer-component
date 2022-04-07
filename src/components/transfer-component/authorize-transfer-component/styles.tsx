import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { AuthorizeTransferComponentStyles } from '.';

const useMergeStyles = (
  style?: AuthorizeTransferComponentStyles
): AuthorizeTransferComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: AuthorizeTransferComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
    },
    countdownContainerStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: 40,
    },
    sendAnotherTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 12,
      lineHeight: 21,
      textDecorationLine: 'underline',
      color: '#FF9800',
    },
    durationTextStyle: {
      fontFamily: fonts.medium,
      fontStyle: 'italic',
      fontSize: 12,
      lineHeight: 21,
      color: 'grey',
    },
    notReceivedCodeTextStyle: {
      fontFamily: fonts.medium,
      fontStyle: 'italic',
      fontSize: 12,
      lineHeight: 21,
      color: colors.primaryTextColor,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
