import React, { useContext, useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { BottomSheet, Button, ThemeContext } from 'react-native-theme-component';
import RadioGroupComponent, { RadioData, RadioGroupComponentStyles } from '../radio-group';
import useMergeStyles from './styles';

export type SelectPurposeModalProps = {
  isVisible: boolean;
  initValue?: string;
  onClose: () => void;
  onValueChanged: (value: RadioData) => void;
  style?: SelectPurposeModalStyles;
};

export type SelectPurposeModalStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  modalTitleStyle?: StyleProp<TextStyle>;
  radioGroupStyle?: RadioGroupComponentStyles;
};

const SelectPurposeModal = ({
  style,
  isVisible,
  onClose,
  onValueChanged,
  initValue,
}: SelectPurposeModalProps) => {
  const styles: SelectPurposeModalStyles = useMergeStyles(style);
  const { colors, i18n } = useContext(ThemeContext);
  const _purposes = [
    { id: '1', label: 'Fund Transfer' },
    { id: '2', label: 'Payment' },
    { id: '3', label: 'Others' },
  ];
  const [value, setValue] = useState<RadioData | undefined>(undefined);

  useEffect(() => {
    if (initValue) {
      setValue(_purposes.find((c) => c.id === initValue || c.label === initValue));
    }
  }, [initValue]);

  return (
    <BottomSheet onBackButtonPress={onClose} onBackdropPress={onClose} isVisible={isVisible}>
      <View style={styles.containerStyle}>
        <Text style={styles.modalTitleStyle}>
          {i18n?.t('input_transfer_component.lbl_purpose_transfer') ?? 'Purpose of transfer'}
        </Text>
        <RadioGroupComponent
          value={value}
          data={_purposes}
          onChangeValue={(v) => {
            setValue(v);
          }}
          style={styles.radioGroupStyle}
        />
        <Button
          onPress={() => {
            onValueChanged(value!);
          }}
          label={i18n?.t('input_transfer_component.btn_select') ?? 'Select'}
          disableColor={colors.secondaryButtonColor}
          disabled={value === undefined}
          style={{
            primaryContainerStyle: {
              marginTop: 30,
            },
          }}
        />
      </View>
    </BottomSheet>
  );
};

export default SelectPurposeModal;
