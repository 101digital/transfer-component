import { isEmpty } from 'lodash';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
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
import ErrorConnectComponent, { ErrorConnectComponentStyles } from '../error-connect-component';
import AllContactComponent from './components/all-contact-component';
import ContactItemComponent, {
  ContactItemComponentStyles,
} from './components/contact-item-component';
import useMergeStyles from './styles';

export type SelectUDAccountComponentProps = {
  onNewRecipient: () => void;
  onSelectedRecipient: (recipient: Recipient) => void;
  arrowRightIcon?: ReactNode;
  disableColor?: string;
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
  emptyContactTextStyle?: StyleProp<TextStyle>;
  loadingContainerStyle?: StyleProp<ViewStyle>;
  accountItemComponentStyle?: ContactItemComponentStyles;
  errorConnectComponentStyle?: ErrorConnectComponentStyles;
};

const SelectUDAccountComponent = ({
  style,
  onNewRecipient,
  onSelectedRecipient,
  arrowRightIcon,
  disableColor,
}: SelectUDAccountComponentProps) => {
  const styles: SelectUDAccountComponentStyles = useMergeStyles(style);
  const { contacts, getContacts, isLoadingContacts, errorLoadContacts } = useContext(
    TransferContext
  );
  const [isShowViewAll, setShowViewAll] = useState(false);
  const { i18n, colors } = useContext(ThemeContext);

  useEffect(() => {
    getContacts();
  }, []);

  if (errorLoadContacts) {
    return (
      <ErrorConnectComponent
        isRefreshing={isLoadingContacts}
        onRefresh={() => {
          getContacts();
        }}
        style={styles.errorConnectComponentStyle}
      />
    );
  }

  const _viewAllColor = contacts.length < 6 ? disableColor ?? '#BAB7BB' : colors.primaryColor;

  return (
    <>
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
            <TouchableOpacity
              disabled={contacts.length < 6}
              activeOpacity={0.8}
              onPress={() => setShowViewAll(true)}
            >
              <Text style={[styles.viewAllTextStyle, { color: _viewAllColor }]}>
                {i18n?.t('select_ud_account_component.btn_view_all') ?? 'View all'}
              </Text>
            </TouchableOpacity>
          </View>
          {isLoadingContacts ? (
            <ActivityIndicator color={colors.primaryColor} style={styles.loadingContainerStyle} />
          ) : isEmpty(contacts) ? (
            <Text style={styles.emptyContactTextStyle}>
              {i18n?.t('select_ud_account_component.msg_empty_contact') ??
                'You have no saved\ncontact as of this moment.'}
            </Text>
          ) : (
            <FlatList
              keyExtractor={(item, index) => `${index}-${item.paymentReference}`}
              data={contacts.slice(0, 5)}
              keyboardShouldPersistTaps='handled'
              renderItem={({ item }) => (
                <ContactItemComponent
                  recipient={item}
                  onPressed={(recipient) => onSelectedRecipient(recipient)}
                  style={styles.accountItemComponentStyle}
                  arrowRightIcon={arrowRightIcon}
                />
              )}
            />
          )}
        </View>
      </View>
      <AllContactComponent
        isVisible={isShowViewAll}
        onClose={() => setShowViewAll(false)}
        onSelectedRecipient={(value) => {
          setShowViewAll(false);
          setTimeout(() => {
            onSelectedRecipient(value);
          }, 200);
        }}
      />
    </>
  );
};

export default SelectUDAccountComponent;
