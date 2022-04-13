import { EBank, PaymentCharge, PaymentProvider } from '../../../../../type';
import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import useMergeStyles from './styles';
import { TransferContext } from '../../../../../context/transfer-context';
import { InstaPayIcon, PesoNetIcon } from '../../../../../assets/icons';
import { ThemeContext, useCurrencyFormat } from 'react-native-theme-component';

export type SelectMethodComponentProps = {
  style?: SelectMethodComponentStyles;
  eBank: EBank;
  currencyCode: string;
  initCharge?: PaymentCharge;
  initProvider?: PaymentProvider;
  onChangedValue: (charge?: PaymentCharge, provider?: PaymentProvider) => void;
};

export type SelectMethodComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  itemContentContainerStyle?: StyleProp<ViewStyle>;
  itemDescriptionStyle?: StyleProp<TextStyle>;
  itemFeeStyle?: StyleProp<TextStyle>;
  radioContainerStyle?: StyleProp<ViewStyle>;
  radioInnerContainerStyle?: StyleProp<ViewStyle>;
  itemSeparatorStyle?: StyleProp<ViewStyle>;
};

const SelectMethodComponent = ({
  style,
  eBank,
  currencyCode,
  onChangedValue,
  initCharge,
  initProvider,
}: SelectMethodComponentProps) => {
  const styles: SelectMethodComponentStyles = useMergeStyles(style);
  const { paymentMethod } = useContext(TransferContext);
  const [charge, setCharge] = useState<PaymentCharge | undefined>(undefined);
  const [_, setProvider] = useState<PaymentProvider | undefined>(undefined);
  const { i18n } = useContext(ThemeContext);

  useEffect(() => {
    setCharge(initCharge);
    setProvider(initProvider);
  }, [initCharge, initProvider]);

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.labelTextStyle}>
        {i18n?.t('input_amount_component.lbl_send_via') ?? 'Send via'}
      </Text>
      <FlatList
        keyExtractor={(item) => item.name}
        data={eBank.paymentProviders}
        ItemSeparatorComponent={() => <View style={styles.itemSeparatorStyle} />}
        renderItem={({ item }) => {
          const _charge = paymentMethod?.Charges.find((c) => c.Provider === item.name);
          const _opacity = item.isActive ? 1 : 0.5;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!item.isActive}
              style={[styles.itemContainerStyle, { opacity: _opacity }]}
              onPress={() => {
                setCharge(_charge);
                setProvider(item);
                onChangedValue(_charge, item);
              }}
            >
              <View style={styles.itemContentContainerStyle}>
                {item.name === 'Instapay' ? (
                  <InstaPayIcon width={77} height={23} />
                ) : (
                  <PesoNetIcon width={77} height={23} />
                )}
                <Text style={styles.itemDescriptionStyle}>{`  • ${item.description}`}</Text>
                <Text style={styles.itemDescriptionStyle}>
                  {`  • ${i18n?.t('input_amount_component.lbl_transfer_fee') ?? 'Transfer Fee'}:`}
                  <Text style={styles.itemFeeStyle}>
                    {_charge?.Fee === 0
                      ? ` ${i18n?.t('input_amount_component.lbl_free') ?? 'FREE'}`
                      : useCurrencyFormat(_charge?.Fee ?? 0, currencyCode)}
                  </Text>
                </Text>
              </View>
              <View style={styles.radioContainerStyle}>
                {charge?.Provider === _charge?.Provider && (
                  <View style={styles.radioInnerContainerStyle} />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default SelectMethodComponent;
