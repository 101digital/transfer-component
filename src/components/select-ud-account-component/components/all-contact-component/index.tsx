import { ArrowBack } from '../../../../assets/icons';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { BottomSheet, Button, KeyboardSpace, ThemeContext } from 'react-native-theme-component';
import useMergeStyles from './styles';
import SearchField, { SearchFieldStyles } from '../search-field';
import { TransferContext } from '../../../../context/transfer-context';
import ContactItemComponent, { ContactItemComponentStyles } from '../contact-item-component';
import { GroupContacts, Recipient } from '../../../../type';
import { filter, isEmpty, values } from 'lodash';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

export type AllContactComponentProps = {
  isVisible: boolean;
  onClose: () => void;
  backIcon?: ReactNode;
  onSelectedRecipient: (recipient: Recipient) => void;
  arrowRightIcon?: ReactNode;
  style?: AllContactComponentStyles;
};

export type AllContactComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  backButtonContainerStyle?: StyleProp<ViewStyle>;
  headerTitleStyle?: StyleProp<TextStyle>;
  subTitleStyle?: StyleProp<TextStyle>;
  searchFieldComponentStyle?: SearchFieldStyles;
  contentContainerStyle?: StyleProp<ViewStyle>;
  accountItemComponentStyle?: ContactItemComponentStyles;
  sectionTextStyle?: StyleProp<TextStyle>;
  footerContainerStyle?: StyleProp<ViewStyle>;
};

const AllContactComponent = ({
  style,
  isVisible,
  onClose,
  backIcon,
  onSelectedRecipient,
  arrowRightIcon,
}: AllContactComponentProps) => {
  const styles: AllContactComponentStyles = useMergeStyles(style);
  const { i18n, colors } = useContext(ThemeContext);
  const { contacts } = useContext(TransferContext);
  const [groupContacts, setGroupContacts] = useState<GroupContacts[]>([]);
  const [selectedContact, setSelectedContact] = useState<Recipient | undefined>(undefined);

  useEffect(() => {
    setGroupContacts(_handleSearch());
    return () => {
      setGroupContacts(_handleSearch());
      setSelectedContact(undefined);
    };
  }, [isVisible]);

  const _handleSearch = (key?: string) => {
    let _contacts = isEmpty(key)
      ? contacts
      : filter(contacts, (c) => c.displayName.toLowerCase().includes(key!.toLowerCase()));
    const _groups: GroupContacts[] = values(
      _contacts
        .map((n) => ({ ...n, section: n.displayName }))
        .sort((a: Recipient, b: Recipient) => {
          return a.displayName.localeCompare(b.displayName, 'es', { sensitivity: 'base' });
        })
        .reduce((r: any, n: Recipient) => {
          let section = n.displayName[0].toUpperCase();
          if (!r[section]) {
            r[section] = { section, items: [n] };
          } else {
            r[section].items.push(n);
          }
          return r;
        }, {})
    );
    return _groups;
  };

  return (
    <BottomSheet
      useSafeArea={false}
      isVisible={isVisible}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      style={{
        containerStyle: styles.containerStyle,
        contentContainerStyle: {
          flex: 1,
          justifyContent: 'flex-start',
        },
      }}
    >
      <SafeAreaView>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClose}
          style={styles.backButtonContainerStyle}
        >
          {backIcon ?? <ArrowBack color={colors.primaryColor} />}
        </TouchableOpacity>
      </SafeAreaView>
      <View style={styles.contentContainerStyle}>
        <Text style={styles.headerTitleStyle}>
          {i18n?.t('select_ud_account_component.lbl_contact_title') ?? 'Contacts'}
        </Text>
        <Text style={styles.subTitleStyle}>
          {i18n?.t('select_ud_account_component.lbl_contact_subtitle') ??
            'Select send money recipient.'}
        </Text>
        <SearchField
          style={
            styles.searchFieldComponentStyle ?? {
              containerStyle: {
                marginTop: 17,
              },
            }
          }
          onSearch={(key) => {
            setGroupContacts(_handleSearch(key));
          }}
          placeholder={
            i18n?.t('select_ud_account_component.plh_search_contact') ?? 'Search contacts'
          }
        />
        <KeyboardAwareFlatList
          keyExtractor={(item) => item.section}
          data={groupContacts}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
          renderItem={({ item }) => {
            return (
              <View>
                <Text style={styles.sectionTextStyle}>{item.section}</Text>
                {item.items.map((contact: Recipient, index: number) => (
                  <ContactItemComponent
                    key={`${index}-${contact.paymentReference}`}
                    recipient={contact}
                    onPressed={(recipient) => setSelectedContact(recipient)}
                    style={styles.accountItemComponentStyle}
                    arrowRightIcon={arrowRightIcon}
                    isSelected={contact === selectedContact}
                  />
                ))}
              </View>
            );
          }}
        />
        <KeyboardSpace style={styles.footerContainerStyle}>
          <Button
            disabled={selectedContact === undefined}
            onPress={() => {
              if (selectedContact) {
                onSelectedRecipient(selectedContact);
              }
            }}
            label={i18n?.t('select_ud_account_component.btn_select') ?? 'Select'}
            disableColor={colors.secondaryButtonColor}
          />
        </KeyboardSpace>
      </View>
    </BottomSheet>
  );
};

export default AllContactComponent;
