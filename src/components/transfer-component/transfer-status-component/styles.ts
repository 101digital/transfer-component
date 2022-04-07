import { defaultsDeep } from 'lodash';
import { StyleSheet } from 'react-native';
import { TransferStatusComponentStyles } from '.';

const useMergeStyles = (style?: TransferStatusComponentStyles): TransferStatusComponentStyles => {
  const defaultStyles: TransferStatusComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
