import {
  CallInterface,
  CallObjectInterface,
  CallObjectInterfaceType,
  ServiceCallFromObject,
} from './ServiceCallAction';
import { MiddlewareAPI } from 'redux';
import {
  ActionNJ,
  DispatchNJ,
  NetClientConstructor,
  NetClientInterface,
  InterceptorType,
  OutActionStarted,
  OutActionFailure,
  OutActionSuccess,
  ServiceClientInterface,
} from './CommonTypes';

class ServiceClient<A extends NetClientInterface> implements ServiceClientInterface<A> {
  baseUrl: string;
  api: MiddlewareAPI;
  next: DispatchNJ;
  checkConnectionLost?: (dispatch: DispatchNJ) => boolean;
  requestInterceptorList: (serviceClient: ServiceClientInterface<A>) => InterceptorType[];
  responseInterceptorList: (serviceClient: ServiceClientInterface<A>) => InterceptorType[];
  printDebug: boolean;

  constructor(
    baseUrl: string,
    api: MiddlewareAPI,
    next: DispatchNJ,
    checkConnectionLost?: (dispatch: DispatchNJ) => boolean,
    requestInterceptorList: (
      serviceClient: ServiceClientInterface<A>
    ) => InterceptorType[] = () => [],
    responseInterceptorList: (
      serviceClient: ServiceClientInterface<A>
    ) => InterceptorType[] = () => [],
    printDebug: boolean = false
  ) {
    this.baseUrl = baseUrl;
    this.api = api;
    this.next = next;
    this.checkConnectionLost = checkConnectionLost;
    this.requestInterceptorList = requestInterceptorList;
    this.responseInterceptorList = responseInterceptorList;
    this.printDebug = printDebug;
  }

  onInnerSuccess = (call: CallInterface) => (response: object) => {
    if (this.printDebug) {
      console.log('[NetJoyBase] Final response before transformation: ', response);
    }
    let transformedResponse = response;
    if (call.transformResponseDataWithState) {
      transformedResponse = call.transformResponseDataWithState(response, this.api.getState());
    }
    if (this.printDebug) {
      console.log('[NetJoyBase] Final response after transformation: ', transformedResponse);
    }
    if (call.successReqType) {
      const out: OutActionSuccess = {
        type: call.successReqType,
        response: transformedResponse,
      };
      this.next(out);
    }
    if (call.onSuccess) {
      call.onSuccess(transformedResponse);
    }
  };

  onInnerFailure = (call: CallInterface) => (error: object) => {
    if (this.printDebug) {
      console.log('[NetJoyBase] Final response error: ', error);
    }
    if (call.failureReqType) {
      const out: OutActionFailure = {
        type: call.failureReqType,
        error,
      };
      this.next(out);
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

    console.log(action);
    if (action.type !== CallObjectInterfaceType.ActionType) {
      this.next(action);
      return;
    }

    const call = ServiceCallFromObject(<CallObjectInterface>action);

    const onInnerSuccess = this.onInnerSuccess(call);
    const onInnerFailure = this.onInnerFailure(call);
    const onInnerFinish = this.onInnerFinish(call);

    if (this.checkConnectionLost !== undefined) {
      if (!this.checkConnectionLost(this.next)) {
        onInnerFailure({ innerMessage: 'Failure Before started due to lack of connection' });
        return;
      }
    }

    let body = '';
    if (call.setBodyFromState) {
      body = call.setBodyFromState(this.api.getState());
    }

    if (call.startedReqType) {
      const out: OutActionStarted = { type: call.startedReqType };
      this.next(out);
    }
    const netClient = new netClientCtor(
      this.baseUrl,
      this.requestInterceptorList(this),
      this.responseInterceptorList(this),
      this.printDebug
    );

    if (this.printDebug) {
      console.log('[NetJoyBase] Started call: ', call);
    }
    netClient.makeCall(
      call.setEndpointFromState!(this.api.getState()),
      call.method,
      body,
      call.getHeadersFromState(this.api.getState()),
      onInnerSuccess,
      onInnerFailure,
      onInnerFinish
    );
  }
}

export default ServiceClient;
