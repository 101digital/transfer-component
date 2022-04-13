import DetailsTransferComponent, {
  DetailsTransferComponentStyles,
} from '../../../detail-transfer-component';
import { TransferContext } from '../../../../../context/transfer-context';
import { TransferDetails } from '../../../../../type';
import moment from 'moment';
import React, {
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { Button, showMessage, ThemeContext } from 'react-native-theme-component';
import useMergeStyles from './styles';
import { isEmpty } from 'lodash';
import { ShareOptions } from 'react-native-share';
import ShareTransferComponent, {
  ShareTransferComponentRef,
} from '../../../../share-transfer-component';

export type TransferSuccessComponentProps = {
  transferDetails: TransferDetails;
  isFromContact: boolean;
  onBack: () => void;
  companyIcon?: ReactNode;
  transactionDateFormat?: string;
  detailTransferComponentStyle?: DetailsTransferComponentStyles;
  style?: TransferSuccessComponentStyles;
};

export type TransferSuccessComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
  mainContainerStyle?: StyleProp<ViewStyle>;
  headerTextStyle?: StyleProp<TextStyle>;
  subHeaderTextStyle?: StyleProp<TextStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  valueTextStyle?: StyleProp<TextStyle>;
  addContactButton?: StyleProp<ViewStyle>;
  addContactButtonLabel?: StyleProp<TextStyle>;
};
export type TransferSuccessComponentRef = {
  share: (shareOptions?: ShareOptions) => void;
};

const TransferSuccessComponent = forwardRef(
  (
    {
      style,
      transferDetails,
      isFromContact,
      onBack,
      companyIcon,
      detailTransferComponentStyle,
      transactionDateFormat,
    }: TransferSuccessComponentProps,
    ref
  ) => {
    const styles: TransferSuccessComponentStyles = useMergeStyles(style);
    const { colors, i18n } = useContext(ThemeContext);
    const {
      transferResponse,
      addContact,
      isAddingContact,
      isAddedContact,
      getContacts,
    } = useContext(TransferContext);
    const shareRef = useRef<ShareTransferComponentRef>();

    const _addContactButtonColor = isFromContact ? '#BAB7BB' : colors.primaryButtonColor;
    const _dateFormat = transactionDateFormat ?? 'MMM D, YYYY / HH:mm A';

    useImperativeHandle(
      ref,
      (): TransferSuccessComponentRef => ({
        share,
      })
    );

    const share = (shareOptions?: ShareOptions) => shareRef?.current?.share(shareOptions);

    useEffect(() => {
      if (isAddedContact) {
        getContacts();
        showMessage({
          message:
            i18n?.t('transfer_status_component.msg_contact_add_successful') ??
            'Contact is added successful',
          backgroundColor: '#2E7D32',
        });
      }
    }, [isAddedContact]);

    const getMessage = () => {
      if (transferDetails.transferType === 'UD' || transferDetails.provider?.name === 'Instapay') {
        return (
          i18n?.t('transfer_status_component.msg_transfer_successful_instantly') ??
          'Your money is on its way and should arrive instantly.'
        );
      }
      return (
        i18n?.t('transfer_status_component.msg_transfer_successful_later') ??
        'Your money is on its way and recipient should receive it %s'
      ).replace('%s', transferDetails.provider?.description ?? 'later');
    };

    return (
      <SafeAreaView style={styles.containerStyle}>
        <ScrollView>
          <ShareTransferComponent
            ref={shareRef}
            style={{
              containerStyle: styles.mainContainerStyle,
            }}
          >
            <Text style={styles.headerTextStyle}>
              {i18n?.t('transfer_status_component.lbl_transfer_successful') ??
                'Transfer Request\nSuccessful!'}
            </Text>
            <Text style={styles.subHeaderTextStyle}>{getMessage()}</Text>
            <DetailsTransferComponent
              details={transferDetails}
              style={detailTransferComponentStyle}
            />
            {transferResponse?.transactionDate && (
              <View style={innerStyles.rowItem}>
                <Text style={styles.labelTextStyle}>
                  {i18n?.t('transfer_status_component.lbl_transaction_date') ??
                    'Transaction Date / Time'}
                </Text>
                <Text style={styles.valueTextStyle}>
                  {moment(transferResponse.transactionDate).format(_dateFormat)}
                </Text>
              </View>
            )}
            {transferResponse?.referenceNo && (
              <View style={innerStyles.rowItem}>
                <Text style={styles.labelTextStyle}>
                  {i18n?.t('transfer_status_component.lbl_reference_no') ?? 'Reference No.'}
                </Text>
                <Text style={styles.valueTextStyle}>{transferResponse?.referenceNo}</Text>
              </View>
            )}
            {companyIcon}
          </ShareTransferComponent>
          <View style={styles.mainContainerStyle}>
            <Button
              onPress={onBack}
              label={i18n?.t('transfer_status_component.btn_back_to_top') ?? 'Back to My Pitaka'}
            />
            {transferDetails.transferType === 'UD' && (
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={isFromContact}
                style={[styles.addContactButton, { borderColor: _addContactButtonColor }]}
                onPress={() => {
                  if (
                    !isEmpty(transferDetails.accountId) &&
                    !isEmpty(transferDetails.accountName) &&
                    !isEmpty(transferDetails.accountNumber)
                  ) {
                    addContact(
                      transferDetails.accountId!,
                      transferDetails.accountNumber!,
                      transferDetails.accountName!
                    );
                  }
                }}
              >
                {isAddingContact && <ActivityIndicator color={_addContactButtonColor} />}
                <Text style={[styles.addContactButtonLabel, { color: _addContactButtonColor }]}>
                  {i18n?.t('transfer_status_component.btn_add_contact') ?? 'Add to contacts'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
);

const innerStyles = StyleSheet.create({
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
});

export default TransferSuccessComponent;
