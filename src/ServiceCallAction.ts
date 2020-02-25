export const API_CALL = 'API_CALL';

export type StateType = any;

export interface CallInterface {
  startedReqType?: string;
  successReqType?: string;
  failureReqType?: string;
  setEndpointFromState: (state?: StateType) => string;
  method: string;
  setBodyFromState?: (state?: StateType) => string;
  getHeadersFromState: (state?: StateType) => object;
  onSuccess?: (response: object) => void;
  onFailure?: (error: object) => void;
  onFinish?: () => void;
  auth: boolean;
  transformResponseDataWithState?: (response: object, state?: StateType) => object;
}

export interface CallObjectInterface {
  [API_CALL]: CallInterface;
}

interface ServiceClientInterface extends CallInterface {
  getAction(): CallObjectInterface;
}

export class ServiceCall implements ServiceClientInterface {
  startedReqType?: string;
  successReqType?: string;
  failureReqType?: string;
  setEndpointFromState: (state?: StateType) => string;
  method: string;
  setBodyFromState?: (state?: StateType) => string;
  getHeadersFromState: (state?: StateType) => object;
  onSuccess?: (response: object) => void;
  onFailure?: (error: object) => void;
  onFinish?: () => void;
  auth: boolean;
  transformResponseDataWithState?: (response: object, state?: StateType) => object;

  constructor(
    setEndpointFromState: (state?: StateType) => string,
    method: string,
    getHeadersFromState: (state?: StateType) => object = () => ({}),
    auth: boolean = false
  ) {
    this.setEndpointFromState = setEndpointFromState;
    this.method = method;
    this.getHeadersFromState = getHeadersFromState;
    this.auth = auth;
  }

  getAction = () => {
    return {
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
        auth: this.auth,
        transformResponseDataWithState: this.transformResponseDataWithState,
      },
    };
  };
}

export function ServiceCallFromObject(objectAction: CallObjectInterface): ServiceClientInterface {
  const object = objectAction[API_CALL];
  let setEndpointFromState, method, getHeadersFromState, auth;
  if ('setEndpointFromState' in object && object.setEndpointFromState !== undefined) {
    setEndpointFromState = object.setEndpointFromState;
  } else {
    throw new Error('Specify a function endpoint URL.');
  }
  if ('method' in object) {
    method = object.method;
  } else {
    throw new Error('');
  }
  if ('getHeadersFromState' in object) {
    getHeadersFromState =
      object.getHeadersFromState !== undefined ? object.getHeadersFromState : () => ({});
  } else {
    throw new Error('');
  }
  if ('auth' in object) {
    auth = object.auth;
  } else {
    throw new Error('');
  }
  const serviceCall = new ServiceCall(setEndpointFromState, method, getHeadersFromState, auth);
  if ('startedReqType' in object) serviceCall.startedReqType = object.startedReqType;
  if ('successReqType' in object) serviceCall.successReqType = object.successReqType;
  if ('failureReqType' in object) serviceCall.failureReqType = object.failureReqType;
  if ('setBodyFromState' in object) serviceCall.setBodyFromState = object.setBodyFromState;
  if ('onSuccess' in object)
    serviceCall.onSuccess = object.onSuccess !== undefined ? object.onSuccess : () => {};
  if ('onFailure' in object)
    serviceCall.onFailure = object.onFailure !== undefined ? object.onFailure : () => {};
  if ('onFinish' in object)
    serviceCall.onFinish = object.onFinish !== undefined ? object.onFinish : () => {};
  if ('transformResponseDataWithState' in object)
    serviceCall.transformResponseDataWithState = object.transformResponseDataWithState;
  return serviceCall;
}
