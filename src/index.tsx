import { NativeModules } from 'react-native';

type ReactNetjoyType = {
  getDeviceName(): Promise<string>;
};

const { ReactNetjoy } = NativeModules;

export default ReactNetjoy as ReactNetjoyType;
