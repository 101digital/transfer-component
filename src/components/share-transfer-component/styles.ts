import { defaultsDeep } from 'lodash';
import { StyleSheet } from 'react-native';
import { ShareTransferComponentStyles } from '.';

const useMergeStyles = (style?: ShareTransferComponentStyles): ShareTransferComponentStyles => {
  const defaultStyles: ShareTransferComponentStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
