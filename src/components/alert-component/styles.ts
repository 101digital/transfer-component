import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { AlertComponentStyles } from '.';

const useMergeStyles = (style?: AlertComponentStyles): AlertComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: AlertComponentStyles = StyleSheet.create({
    containerStyle: {
      width: '90%',
      borderRadius: 10,
      backgroundColor: 'white',
      paddingTop: 5,
      paddingBottom: 5,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    modalStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },
    actionContainerStyle: {
      width: '100%',
      marginVertical: 32,
    },
    buttonSpacerStyle: {
      height: 10,
    },
    cancelButtonContainerStyle: {
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelLabelStyle: {
      fontFamily: fonts.bold,
      fontSize: 14,
      lineHeight: 21,
      color: '#FF9800',
      textDecorationLine: 'underline',
    },
    centerHeaderContainerStyle: {
      paddingTop: 40,
      paddingBottom: 33,
    },
    titleStyle: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: colors.primaryColor,
    },
    messageStyle: {
      fontFamily: fonts.medium,
      fontSize: 14,
      lineHeight: 24,
      textAlign: 'center',
      marginTop: 12,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
