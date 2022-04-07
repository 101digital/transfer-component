import React, { ReactNode, useContext, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ThemeContext } from 'react-native-theme-component';
import { ArrowRightIcon } from '../../assets/icons';
import { TransferContext } from '../../context/transfer-context';
import { PaymentMethod } from '../../type';
import useMergeStyles from './styles';

export type TransferMethodComponentProps = {
  style?: TransferMethodComponentStyles;
  arrowRightIcon?: (isActive: boolean) => ReactNode;
  onPressed: (method: PaymentMethod) => void;
};

export type TransferMethodComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  headerTitleStyle?: StyleProp<TextStyle>;
  headerSubTitleStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  buttonContainerStyle?: StyleProp<ViewStyle>;
  disableButtonContainerStyle?: StyleProp<ViewStyle>;
  buttonLabelStyle?: StyleProp<TextStyle>;
  disableButtonLabelStyle?: StyleProp<TextStyle>;
  disabledTextStyle?: StyleProp<TextStyle>;
  itemSeparatorStyle?: StyleProp<ViewStyle>;
};

const TransferMethodComponent = ({
  style,
  arrowRightIcon,
  onPressed,
}: TransferMethodComponentProps) => {
  const styles: TransferMethodComponentStyles = useMergeStyles(style);
  const { getPaymentMethod, isLoadingPaymentMethod, paymentMethods, setPaymentMethod } = useContext(
    TransferContext
  );
  const { i18n, colors } = useContext(ThemeContext);

  useEffect(() => {
    getPaymentMethod();
  }, []);

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.headerTitleStyle}>
        {i18n?.t('transfer_method_component.lbl_header_title') ?? 'Send Money'}
      </Text>
      <Text style={styles.headerSubTitleStyle}>
        {i18n?.t('transfer_method_component.lbl_header_subtitle') ?? 'Choose where to transfer.'}
      </Text>
      <View style={styles.contentContainerStyle}>
        {isLoadingPaymentMethod ? (
          <ActivityIndicator color={colors.primaryColor} />
        ) : (
          <FlatList
            keyExtractor={(item) => item.LocalInstrument}
            data={paymentMethods}
            ItemSeparatorComponent={() => <View style={styles.itemSeparatorStyle} />}
            renderItem={({ item }) => (
              <>
                <TouchableOpacity
                  disabled={!item.IsActive}
                  activeOpacity={0.8}
                  style={
                    item.IsActive ? styles.buttonContainerStyle : styles.disableButtonContainerStyle
                  }
                  onPress={() => {
                    setPaymentMethod(item);
                    onPressed(item);
                  }}
                >
                  <Text
                    style={item.IsActive ? styles.buttonLabelStyle : styles.disableButtonLabelStyle}
                  >
                    {item.Description}
                  </Text>
                  {arrowRightIcon?.(item.IsActive) ?? (
                    <ArrowRightIcon size={12} color={item.IsActive ? '#FF9800' : '#BAB7BB'} />
                  )}
                </TouchableOpacity>
                {!item.IsActive && (
                  <Text style={styles.disabledTextStyle}>
                    {item.Reason ??
                      i18n?.t('transfer_method_component.msg_service_unavailable') ??
                      'Service temporarily unavailable'}
                  </Text>
                )}
              </>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default TransferMethodComponent;
