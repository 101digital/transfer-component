import React, { ReactNode } from 'react';
import { useTransferContextValue, TransferContext } from './transfer-context';

export type TransferProviderProps = {
  children: ReactNode;
};

const TransferProvider = (props: TransferProviderProps) => {
  const { children } = props;
  const transferContextData = useTransferContextValue();

  return (
    <TransferContext.Provider value={transferContextData}>{children}</TransferContext.Provider>
  );
};

export default TransferProvider;
