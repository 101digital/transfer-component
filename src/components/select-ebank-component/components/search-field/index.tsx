import { ClearIcon, SearchIcon } from '../../../../assets/icons';
import { Formik } from 'formik';
import { debounce, isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { InputField } from 'react-native-theme-component';
import { SearchData } from './model';
import useMergeStyles from './styles';

export type SearchFieldProps = {
  onSearch: (key: string) => void;
  placeholder: string;
  style?: SearchFieldStyles;
};

export type SearchFieldStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  prefixContainerStyle?: StyleProp<ViewStyle>;
  suffixContainerStyle?: StyleProp<ViewStyle>;
};

const SearchField = ({ style, onSearch, placeholder }: SearchFieldProps) => {
  const styles: SearchFieldStyles = useMergeStyles(style);

  const _onSearch = useCallback(
    debounce(function (k) {
      onSearch(k);
    }, 300),
    []
  );

  return (
    <View style={styles.containerStyle}>
      <Formik enableReinitialize={true} initialValues={SearchData.empty()} onSubmit={(_) => {}}>
        {({ setFieldValue, values }) => (
          <InputField
            style={{
              contentContainerStyle: {
                height: 42,
              },
            }}
            onChangeText={(text) => {
              setFieldValue('key', text);
              _onSearch(text);
            }}
            autoCapitalize='none'
            name='key'
            placeholder={placeholder}
            returnKeyType='go'
            prefixIcon={
              <View style={styles.prefixContainerStyle}>
                <SearchIcon width={24} height={24} />
              </View>
            }
            suffixIcon={
              isEmpty(values.key) ? (
                <View />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setFieldValue('key', '');
                    _onSearch('');
                  }}
                  activeOpacity={0.8}
                  style={styles.suffixContainerStyle}
                >
                  <ClearIcon width={24} height={24} />
                </TouchableOpacity>
              )
            }
          />
        )}
      </Formik>
    </View>
  );
};

export default SearchField;
