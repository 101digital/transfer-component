import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import useMergeStyles from './styles';

export type RadioData = {
  id: string | number;
  label: string;
};

export type RadioGroupComponentProps = {
  variant?: 'outline' | 'inner';
  value?: RadioData;
  data: RadioData[];
  onChangeValue: (value: RadioData) => void;
  style?: RadioGroupComponentStyles;
};

export type RadioGroupComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  titleTextStyle?: StyleProp<TextStyle>;
  outlineContainerStyle?: StyleProp<ViewStyle>;
  activeOutlineStyle?: StyleProp<ViewStyle>;
  innerContainerStyle?: StyleProp<ViewStyle>;
  activeInnerStyle?: StyleProp<ViewStyle>;
};

const RadioGroupComponent = ({
  style,
  data,
  onChangeValue,
  value,
  variant,
}: RadioGroupComponentProps) => {
  const styles: RadioGroupComponentStyles = useMergeStyles(style);

  return (
    <View style={styles.containerStyle}>
      {data.map((d) => (
        <TouchableOpacity
          key={d.id}
          activeOpacity={0.8}
          onPress={() => onChangeValue(d)}
          style={styles.itemContainerStyle}
        >
          <Text style={styles.titleTextStyle}>{d.label}</Text>
          <View
            style={variant === 'inner' ? styles.innerContainerStyle : styles.outlineContainerStyle}
          >
            {value?.id === d.id && (
              <View
                style={variant === 'inner' ? styles.activeInnerStyle : styles.activeOutlineStyle}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

RadioGroupComponent.defaultProps = {
  variant: 'outline',
};

export default RadioGroupComponent;
