import { defaultsDeep } from 'lodash';
import { useContext } from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { AllContactComponentStyles } from '.';

const useMergeStyles = (style?: AllContactComponentStyles): AllContactComponentStyles => {
  const { colors, fonts } = useContext(ThemeContext);

  const defaultStyles: AllContactComponentStyles = StyleSheet.create({
    backButtonContainerStyle: {
      paddingVertical: 20,
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
    containerStyle: {
      flex: 1,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      backgroundColor: colors.appBarBackgroundColor,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    contentContainerStyle: {
      flex: 1,
      paddingHorizontal: 24,
    },
    sectionTextStyle: {
      fontFamily: fonts.bold,
      fontSize: 12,
      lineHeight: 24,
      color: '#7F7B82',
      marginTop: 12,
      marginBottom: 8,
    },
    footerContainerStyle: {
      paddingBottom: 24,
      paddingTop: 18,
      paddingHorizontal: 24,
      backgroundColor: 'rgba(246, 250, 255, 0.8)',
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
