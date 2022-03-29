import { defaultsDeep } from 'lodash';
import { StyleSheet } from 'react-native';
import { ReviewTransferComponentStyles } from '.';

const useMergeStyles = (style?: ReviewTransferComponentStyles): ReviewTransferComponentStyles => {
  const defaultStyles: ReviewTransferComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
    },
    footerContainerStyle: {
      padding: 24,
      backgroundColor: 'rgba(246, 250, 255, 0.8)',
      shadowColor: 'grey',
      shadowOpacity: 0.2,
      shadowOffset: {
        width: 0,
        height: -10,
      },
      shadowRadius: 10,
      elevation: 5,
    },
    contentContainerStyle: {
      flex: 1,
      paddingHorizontal: 24,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
