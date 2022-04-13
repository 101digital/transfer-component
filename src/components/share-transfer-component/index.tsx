import React, { forwardRef, ReactNode, useImperativeHandle, useRef } from 'react';
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import useMergeStyles from './styles';
import ViewShot, { CaptureOptions } from 'react-native-view-shot';
import Share, { ShareOptions } from 'react-native-share';

export type ShareTransferComponentProps = {
  style?: ShareTransferComponentStyles;
  children: ReactNode;
  captureOptions?: CaptureOptions;
};

export type ShareTransferComponentStyles = {
  containerStyle?: StyleProp<ViewStyle>;
};

export type ShareTransferComponentRef = {
  share: (shareOptions?: ShareOptions) => void;
};

const ShareTransferComponent = forwardRef(
  ({ style, captureOptions, children }: ShareTransferComponentProps, ref) => {
    const styles: ShareTransferComponentStyles = useMergeStyles(style);
    const viewShotRef = useRef<any>(null);

    useImperativeHandle(
      ref,
      (): ShareTransferComponentRef => ({
        share,
      })
    );

    const share = async (shareOptions?: ShareOptions) => {
      const res = await viewShotRef?.current?.capture();
      const urlString = `data:image/jpeg;base64,${res}`;
      const options = {
        ...shareOptions,
        url: urlString,
      };
      await Share.open(options);
    };

    return (
      <ViewShot
        style={innerStyle.container}
        ref={viewShotRef}
        options={
          captureOptions ?? {
            quality: 1,
            result: 'base64',
          }
        }
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.containerStyle}>
          {children}
        </ScrollView>
      </ViewShot>
    );
  }
);

const innerStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ShareTransferComponent;
