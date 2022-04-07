import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { TransferComponentStyles } from '.';

const useMergeStyles = (style?: TransferComponentStyles): TransferComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: TransferComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
    },
    headerTitleStyle: {
      lineHeight: 36,
      color: colors.primaryColor,
      fontFamily: fonts.bold,
      fontSize: 24,
      paddingHorizontal: 24,
    },
    headerSubTitleStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      color: colors.secondaryTextColor,
      marginTop: 20,
      paddingHorizontal: 24,
    },
    headerContainerStyle: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftButtonStyle: {
      paddingVertical: 20,
      paddingHorizontal: 24,
    },
    rightButtonStyle: {
      paddingVertical: 15,
      paddingHorizontal: 24,
    },
    rightButtonTitleStyle: {
      fontFamily: fonts.bold,
      fontSize: 14,
      textDecorationLine: 'underline',
      color: '#FF9800',
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
