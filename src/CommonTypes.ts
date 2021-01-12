import { AnyAction, MiddlewareAPI } from 'redux';
import { CallInterface, CallObjectInterface } from './ServiceCallAction';

type ActionNJ = AnyAction | OutAction | CallObjectInterface;

type OutActionStarted = {
  type: string;
};

type OutActionSuccess = {
  type: string;
  response: any;
};

type OutActionFailure = {
  type: string;
  error: any; // Integrate error system
};

type OutAction = OutActionStarted | OutActionSuccess | OutActionFailure;

interface Dispatch<A extends ActionNJ = AnyAction> {
  <T extends A>(action: T): T;
}

type DispatchNJ = Dispatch<ActionNJ>;

interface NetClientConstructor {
  new (
    baseUrl: string,
    requestInterceptorList: InterceptorType[],
    responseInterceptorList: InterceptorType[],
    printDebug: boolean
  ): NetClientInterface;
}

interface NetClientInterface {
  makeCall(
    url: string,
    method: string,
    body: string,
    headers: object,
    onSuccess: (response: object) => void,
    onFailure: (error: object) => void,
    onFinish: () => void
  ): void;
}

type SuccessMethodType = (config: object) => object;
type FailureMethodType = (error: object) => object;
type InterceptorType = {
  success?: SuccessMethodType;
  error?: FailureMethodType;
};

interface ServiceClientInterface<A extends NetClientInterface> {
  baseUrl: string;
  api: MiddlewareAPI;
  next: DispatchNJ;
  checkConnectionLost?: (dispatch: DispatchNJ) => boolean;
  requestInterceptorList: (serviceClient: ServiceClientInterface<A>) => InterceptorType[];
  responseInterceptorList: (serviceClient: ServiceClientInterface<A>) => InterceptorType[];
  onInnerSuccess: (call: CallInterface) => (response: object) => void;
  onInnerFailure: (call: CallInterface) => (error: object) => void;
  onInnerFinish(call: CallInterface): () => void;
  executeAction(action: ActionNJ, netClientCtor: NetClientConstructor): void;
}

export {
  ActionNJ,
  OutActionStarted,
  OutActionSuccess,
  OutActionFailure,
  OutAction,
  DispatchNJ,
  InterceptorType,
  NetClientConstructor,
  NetClientInterface,
  FailureMethodType,
  SuccessMethodType,
  ServiceClientInterface
};
