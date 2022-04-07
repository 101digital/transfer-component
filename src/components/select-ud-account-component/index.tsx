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
import { AddIcon } from '../../assets/icons';
import { TransferContext } from '../../context/transfer-context';
import { Recipient } from '../../type';
import ContactItemComponent, {
  ContactItemComponentStyles,
} from './components/contact-item-component';
import useMergeStyles from './styles';

export type SelectUDAccountComponentProps = {
  onNewRecipient: () => void;
  onSelectedRecipient: (recipient: Recipient) => void;
  arrowRightIcon?: ReactNode;
  style?: SelectUDAccountComponentStyles;
};

export type SelectUDAccountComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  headerTitleStyle?: StyleProp<TextStyle>;
  subTitleStyle?: StyleProp<TextStyle>;
  newReceiptButtonStyle?: StyleProp<ViewStyle>;
  newReceiptLabelStyle?: StyleProp<TextStyle>;
  recentContactContainerStyle?: StyleProp<ViewStyle>;
  recentContactHeaderContainerStyle?: StyleProp<ViewStyle>;
  recentContactTitleStyle?: StyleProp<TextStyle>;
  viewAllTextStyle?: StyleProp<TextStyle>;
  loadingContainerStyle?: StyleProp<ViewStyle>;
  accountItemComponentStyle?: ContactItemComponentStyles;
};

const SelectUDAccountComponent = ({
  style,
  onNewRecipient,
  onSelectedRecipient,
  arrowRightIcon,
}: SelectUDAccountComponentProps) => {
  const styles: SelectUDAccountComponentStyles = useMergeStyles(style);
  const { contacts, getContacts, isLoadingContacts } = useContext(TransferContext);
  const { i18n, colors } = useContext(ThemeContext);

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.headerTitleStyle}>
        {i18n?.t('select_ud_account_component.lbl_header_title') ??
          'Send to another\nUnionDigital account'}
      </Text>
      <Text style={styles.subTitleStyle}>
        {i18n?.t('select_ud_account_component.lbl_header_subtitle') ??
          'Who are you sending your money to?'}
      </Text>
      <TouchableOpacity
        onPress={onNewRecipient}
        activeOpacity={0.8}
        style={styles.newReceiptButtonStyle}
      >
        <AddIcon size={40} />
        <Text style={styles.newReceiptLabelStyle}>
          {i18n?.t('select_ud_account_component.btn_new_recipient') ?? 'New Recipient'}
        </Text>
      </TouchableOpacity>
      <View style={styles.recentContactContainerStyle}>
        <View style={styles.recentContactHeaderContainerStyle}>
          <Text style={styles.recentContactTitleStyle}>
            {i18n?.t('select_ud_account_component.lbl_recent_contact') ?? 'Recent Contacts'}
          </Text>
          <Text style={styles.viewAllTextStyle}>
            {i18n?.t('select_ud_account_component.btn_view_all') ?? 'View all'}
          </Text>
        </View>
        {isLoadingContacts && (
          <ActivityIndicator color={colors.primaryColor} style={styles.loadingContainerStyle} />
        )}
        <FlatList
          keyExtractor={(item) => item.userId}
          data={contacts}
          renderItem={({ item }) => {
            return (
              <ContactItemComponent
                recipient={item}
                onPressed={(recipient) => {
                  onSelectedRecipient(recipient);
                }}
                style={styles.accountItemComponentStyle}
                arrowRightIcon={arrowRightIcon}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default SelectUDAccountComponent;
