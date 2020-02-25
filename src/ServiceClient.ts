import {
  API_CALL,
  CallInterface,
  CallObjectInterface,
  ServiceCallFromObject,
} from './ServiceCallAction';
import { Store } from 'redux';
import { ActionNJ, DispatchNJ, NetClientConstructor, NetClientInterface } from './CommonTypes';
import {
  InterceptorType,
  RequestAuthInterceptorType,
  ResponseAuthInterceptorType,
} from './Interceptors';

export interface ServiceClientInterface<A extends NetClientInterface> {
  baseUrl: string;
  store: Store;
  next: DispatchNJ;
  checkConnectionLost?: (dispatch: DispatchNJ) => void;
  authRequestInterceptor?: (serviceClient: ServiceClientInterface<A>) => RequestAuthInterceptorType;
  authResponseInterceptor?: (
    serviceClient: ServiceClientInterface<A>
  ) => ResponseAuthInterceptorType;
  requestInterceptors: (serviceClient: ServiceClientInterface<A>) => InterceptorType[];
  responseInterceptors: (serviceClient: ServiceClientInterface<A>) => InterceptorType[];

  onInnerSuccess: (call: CallInterface) => (response: object) => void;
  onInnerFailure: (call: CallInterface) => (error: object) => void;
  onInnerFinish(call: CallInterface): () => void;
  executeAction(action: ActionNJ, netClientCtor: NetClientConstructor): void;
}

class ServiceClient<A extends NetClientInterface> implements ServiceClientInterface<A> {
  baseUrl: string;
  store: Store;
  next: DispatchNJ;
  checkConnectionLost?: (dispatch: DispatchNJ) => void;
  authRequestInterceptor?: (serviceClient: ServiceClientInterface<A>) => RequestAuthInterceptorType;
  authResponseInterceptor?: (
    serviceClient: ServiceClientInterface<A>
  ) => ResponseAuthInterceptorType;
  requestInterceptors: (serviceClient: ServiceClientInterface<A>) => InterceptorType[];
  responseInterceptors: (serviceClient: ServiceClientInterface<A>) => InterceptorType[];

  constructor(
    baseUrl: string,
    store: Store,
    next: DispatchNJ,
    checkConnectionLost?: (dispatch: DispatchNJ) => void,
    authRequestInterceptor?: (
      serviceClient: ServiceClientInterface<A>
    ) => RequestAuthInterceptorType,
    authResponseInterceptor?: (
      serviceClient: ServiceClientInterface<A>
    ) => ResponseAuthInterceptorType,
    requestInterceptors: (serviceClient: ServiceClientInterface<A>) => InterceptorType[] = () => [],
    responseInterceptors: (serviceClient: ServiceClientInterface<A>) => InterceptorType[] = () => []
  ) {
    this.baseUrl = baseUrl;
    this.store = store;
    this.next = next;
    this.checkConnectionLost = checkConnectionLost;
    this.authRequestInterceptor = authRequestInterceptor;
    this.authResponseInterceptor = authResponseInterceptor;
    this.requestInterceptors = requestInterceptors;
    this.responseInterceptors = responseInterceptors;
  }

  onInnerSuccess = (call: CallInterface) => (response: object) => {
    let transformedResponse = response;
    if (call.transformResponseDataWithState) {
      transformedResponse = call.transformResponseDataWithState(response, this.store.getState());
    }
    if (call.successReqType) {
      this.next({
        type: call.successReqType,
        response: transformedResponse,
      });
    }
    if (call.onSuccess) {
      call.onSuccess(transformedResponse);
    }
  };

  onInnerFailure = (call: CallInterface) => (error: object) => {
    if (call.failureReqType) {
      this.next({
        type: call.failureReqType,
        error,
      });
    }
    if (call.onFailure) {
      call.onFailure(error);
    }
  };

  onInnerFinish = (call: CallInterface) => () => {
    if (call.onFinish) {
      call.onFinish();
    }
  };

  executeAction(action: ActionNJ, netClientCtor: NetClientConstructor) {
    if (!action) return;

    const apiCallAction = action[API_CALL];
    if (!apiCallAction) {
      this.next(action);
      return;
    }

    if (this.checkConnectionLost !== undefined) {
      this.checkConnectionLost(this.next);
    }

    const call = ServiceCallFromObject(<CallObjectInterface>action);

    let body = '';
    if (call.setBodyFromState) {
      body = call.setBodyFromState(this.store.getState());
    }

    const onInnerSuccess = this.onInnerSuccess(call);
    const onInnerFailure = this.onInnerFailure(call);
    const onInnerFinish = this.onInnerFinish(call);

    if (call.startedReqType) {
      this.next({ type: call.startedReqType });
    }
    const netClient = new netClientCtor(
      this.baseUrl,
      call.auth,
      this.requestInterceptors(this),
      this.responseInterceptors(this),
      this.authRequestInterceptor!(this),
      this.authResponseInterceptor!(this)
    );
    netClient.makeCall(
      call.setEndpointFromState(this.store.getState()),
      call.method,
      body,
      call.getHeadersFromState(this.store.getState()),
      onInnerSuccess,
      onInnerFailure,
      onInnerFinish
    );
  }
}

export default ServiceClient;
