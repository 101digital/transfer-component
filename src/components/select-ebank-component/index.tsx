import { filter, isEmpty, values } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { ThemeContext } from 'react-native-theme-component';
import { TransferContext } from '../../context/transfer-context';
import { EBank, GroupEBank } from '../../type';
import ItemEBankComponent from './components/item-ebank-component';
import SearchField from './components/search-field';
import useMergeStyles from './styles';

export type SelectEBankComponentProps = {
  style?: SelectEBankComponentStyles;
  onNext: (eBank: EBank) => void;
};

export type SelectEBankComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  headerTitleStyle?: StyleProp<TextStyle>;
  subTitleStyle?: StyleProp<TextStyle>;
  emptyResultTextStyle?: StyleProp<TextStyle>;
  eBankListStyle?: StyleProp<ViewStyle>;
  sectionTextStyle?: StyleProp<TextStyle>;
  loadingIndicatorStyle?: StyleProp<ViewStyle>;
};

const SelectEBankComponent = ({ style, onNext }: SelectEBankComponentProps) => {
  const styles: SelectEBankComponentStyles = useMergeStyles(style);
  const { getEBanks, isLoadingBank, eBanks } = useContext(TransferContext);
  const { i18n, colors } = useContext(ThemeContext);
  const [groupEBanks, setGroupEBank] = useState<GroupEBank[]>([]);

  useEffect(() => {
    getEBanks();
  }, []);

  useEffect(() => {
    setGroupEBank(_handleSearch());
    return () => {
      setGroupEBank(_handleSearch());
    };
  }, [eBanks]);

  const _handleSearch = (key?: string) => {
    let _banks = isEmpty(key)
      ? eBanks
      : filter(eBanks, (b) => b.name.toLowerCase().includes(key!.toLowerCase()));
    const _groups: GroupEBank[] = values(
      _banks
        .map((n) => ({
          ...n,
          section: n.name === 'UnionBank' ? 'Featured' : n.name,
        }))
        .sort((a: EBank, b: EBank) => {
          return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
        })
        .reduce((r: any, c: EBank) => {
          let section = c.name === 'UnionBank' ? 'Featured' : c.name[0].toUpperCase();
          if (!r[section]) {
            r[section] = { section, items: [c] };
          } else {
            r[section].items.push(c);
          }
          return r;
        }, {})
    );
    const _featuredIndex = _groups.findIndex((g) => g.section === 'Featured');
    if (_featuredIndex !== -1) {
      return [
        _groups[_featuredIndex],
        ..._groups.slice(0, _featuredIndex),
        ..._groups.slice(_featuredIndex + 1),
      ];
    }
    return _groups;
  };

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.headerTitleStyle}>
        {i18n?.t('select_ewallet_component.lbl_header_title') ?? 'Send to other banks or e-wallets'}
      </Text>
      <Text style={styles.subTitleStyle}>
        {i18n?.t('select_ewallet_component.lbl_header_subtitle') ?? 'Select a bank or ewallet.'}
      </Text>
      <SearchField
        style={{
          containerStyle: {
            marginTop: 17,
          },
        }}
        onSearch={(key) => {
          setGroupEBank(_handleSearch(key));
        }}
        placeholder={
          i18n?.t('select_ewallet_component.plh_search') ?? 'Search for a bank or ewallet'
        }
      />
      {isLoadingBank ? (
        <ActivityIndicator style={styles.loadingIndicatorStyle} color={colors.primaryColor} />
      ) : isEmpty(groupEBanks) ? (
        <Text style={styles.emptyResultTextStyle}>{'No results found.'}</Text>
      ) : (
        <KeyboardAwareFlatList
          keyExtractor={(item) => item.section}
          data={groupEBanks}
          keyboardShouldPersistTaps='handled'
          style={styles.eBankListStyle}
          showsVerticalScrollIndicator={false}
          keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
          renderItem={({ item }) => {
            return (
              <>
                <Text style={styles.sectionTextStyle}>{item.section}</Text>
                {item.items.map((item: EBank) => (
                  <ItemEBankComponent
                    key={item.id}
                    eBank={item}
                    onPressed={() => {
                      onNext(item);
                    }}
                  />
                ))}
              </>
            );
          }}
        />
      )}
    </View>
  );
};

export default SelectEBankComponent;
