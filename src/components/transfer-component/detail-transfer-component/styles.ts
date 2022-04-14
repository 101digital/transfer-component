import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { DetailsTransferComponentStyles } from '.';

const useMergeStyles = (style?: DetailsTransferComponentStyles): DetailsTransferComponentStyles => {
  const { fonts, colors } = useContext(ThemeContext);

  const defaultStyles: DetailsTransferComponentStyles = StyleSheet.create({
    containerStyle: {
      backgroundColor: '#ffffff',
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingTop: 18,
      marginVertical: 20,
      paddingBottom: 30,
    },
    labelTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 12,
      lineHeight: 21,
      color: '#7F7B82',
      marginTop: 12,
    },
    valueTextStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      color: colors.primaryTextColor,
    },
    editReceiverButtonStyle: {
      position: 'absolute',
      right: -10,
      padding: 10,
      top: 5,
    },
    editAmountButtonStyle: {
      position: 'absolute',
      right: -10,
      padding: 10,
      top: 5,
    },
  });
  return defaultsDeep(style, defaultStyles);
};
export default useMergeStyles;
