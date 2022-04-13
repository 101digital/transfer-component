import { defaultsDeep } from 'lodash';
import { StyleSheet } from 'react-native';
import { SearchFieldStyles } from '.';

const useMergeStyles = (style?: SearchFieldStyles): SearchFieldStyles => {
  const defaultStyles: SearchFieldStyles = StyleSheet.create({
    prefixContainerStyle: {
      paddingLeft: 12,
    },
    suffixContainerStyle: {
      paddingRight: 17,
    },
  });

  return defaultsDeep(style, defaultStyles);
};

export default useMergeStyles;
