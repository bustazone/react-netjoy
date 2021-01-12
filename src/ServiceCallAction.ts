export const API_CALL = 'API_CALL';

export type StateType = any;

export interface CallInterface {
  startedReqType?: string;
  successReqType?: string;
  failureReqType?: string;
  setEndpointFromState?: (state?: StateType) => string;
  method: string;
  setBodyFromState?: (state?: StateType) => string;
  getHeadersFromState: (state?: StateType) => object;
  onSuccess: (response: object) => void;
  onFailure: (error: object) => void;
  onFinish: () => void;
  transformResponseDataWithState?: (response: any, state?: StateType) => any;
}

export enum CallObjectInterfaceType {
  ActionType = 'react-netjoy-action',
}

export interface CallObjectInterface {
  type: CallObjectInterfaceType.ActionType;
  [API_CALL]: CallInterface;
}

interface ServiceClientInterface extends CallInterface {
  getAction(): CallObjectInterface;
}

export class ServiceCall implements ServiceClientInterface {
  startedReqType?: string;
  successReqType?: string;
  failureReqType?: string;
  setEndpointFromState?: (state?: StateType) => string;
  method: string;
  setBodyFromState?: (state?: StateType) => string;
  getHeadersFromState: (state?: StateType) => object;
  onSuccess: (response: object) => void;
  onFailure: (error: object) => void;
  onFinish: () => void;
  transformResponseDataWithState?: (response: any, state?: StateType) => any;

  constructor() {
    this.method = 'GET';
    this.getHeadersFromState = () => ({});
    this.onSuccess = () => {};
    this.onFailure = () => {};
    this.onFinish = () => {};
  }

  getAction = () => {
    console.log('action');
    console.log(this);
    if (this.setEndpointFromState !== undefined) {
      return {
        type: CallObjectInterfaceType.ActionType,
        [API_CALL]: {
          startedReqType: this.startedReqType,
          successReqType: this.successReqType,
          failureReqType: this.failureReqType,
          setEndpointFromState: this.setEndpointFromState,
          method: this.method,
          setBodyFromState: this.setBodyFromState,
          getHeadersFromState: this.getHeadersFromState,
          onSuccess: this.onSuccess,
          onFailure: this.onFailure,
          onFinish: this.onFinish,
          transformResponseDataWithState: this.transformResponseDataWithState,
        },
      };
    } else {
      throw new Error("You've to specify a function endpoint URL.");
    }
  };
}

export function ServiceCallFromObject(objectAction: CallObjectInterface): ServiceClientInterface {
  const object = objectAction[API_CALL];
  if (object === undefined) {
    throw new Error(`The object action in incorrect: ${JSON.stringify(objectAction)}`);
  }
  const serviceCall = new ServiceCall();
  if ('setEndpointFromState' in object)
    serviceCall.setEndpointFromState = object.setEndpointFromState;
  if ('method' in object) serviceCall.method = object.method;
  if ('getHeadersFromState' in object) serviceCall.getHeadersFromState = object.getHeadersFromState;
  if ('startedReqType' in object) serviceCall.startedReqType = object.startedReqType;
  if ('successReqType' in object) serviceCall.successReqType = object.successReqType;
  if ('failureReqType' in object) serviceCall.failureReqType = object.failureReqType;
  if ('setBodyFromState' in object) serviceCall.setBodyFromState = object.setBodyFromState;
  if ('onSuccess' in object) serviceCall.onSuccess = object.onSuccess;
  if ('onFailure' in object) serviceCall.onFailure = object.onFailure;
  if ('onFinish' in object) serviceCall.onFinish = object.onFinish;
  if ('transformResponseDataWithState' in object)
    serviceCall.transformResponseDataWithState = object.transformResponseDataWithState;
  return serviceCall;
}
