# transfer-component

**transfer-component** is a reusable component for making a transfer

## Features

- Select transfer method (UD to UD, UD to e-bank or wallet)
- Select e-bank or wallet
- Select UD account or get UD account from device contact
- Init transfer, authorize transfer, share transfer

## Installation

To add this component to React Native app, run this command:

```sh
yarn add https://github.com/101digital/transfer-component.git#[version]
```

Make sure you have permission to access this repository

Because **transfer-component** depends on some libraries, so make sure you installed all dependencies into your project.

- [react-native-theme-component](https://github.com/101digital/react-native-theme-component.git)

## Quick Start

### Init API Service

`TransferService` is initiated should be from `App.ts`

```javascript
import { TransferService, TransferProvider } from 'transfer-component';

TransferService.instance().initClients({
  paymentClient: createAuthorizedApiClient(payment),
  contactClient: createAuthorizedApiClient(contact),
  bankInformationClient: createAuthorizedApiClient(bankInformation),
  schemes: {
    udScheme: 'PH.PlatformDefined.Id', // scheme can be different base on BE config
    pesonetScheme: 'PH.BRSTN.AccountNumer', // scheme can be different base on BE config
    instapayScheme: '', // scheme can be different base on BE config
  },
});
```

### Init Component Provider

Wrapped the app with `TransferProvider`

```javascript
import { TransferService, TransferProvider } from 'transfer-component';

const App = () => {
  return (
    <View>
      <TransferProvider>{/* YOUR APP COMPONENTS */}</TransferProvider>
    </View>
  );
};

export default App;
```

### Assets And Multiple Languages

- All icons, images and texts are provided by default. You can use your custom by passing them as a props into each component

- In order to do multiple languages, you need to configurate `i18n` for [react-native-theme-component](https://github.com/101digital/react-native-theme-component.git). And then, you have to copy and paste all fields and values in [texts](transfer-component-data.json) into your app locale file. You can also change text value, but DON'T change the key.
