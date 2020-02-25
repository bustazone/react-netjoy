import ServiceClient, { ServiceClientInterface } from './ServiceClient';
import { Store } from 'redux';
import {
  InterceptorType,
  RequestAuthInterceptorType,
  ResponseAuthInterceptorType,
} from './Interceptors';
import { ActionNJ, DispatchNJ, NetClientConstructor, NetClientInterface } from './CommonTypes';

export function getServiceClientMiddleware<A extends NetClientInterface>(
  netClientCtor: NetClientConstructor,
  baseUrl: string,
  checkConnectionLost?: (dispatch: DispatchNJ) => void,
  authRequestInterceptor?: (serviceClient: ServiceClientInterface<A>) => RequestAuthInterceptorType,
  authResponseInterceptor?: (
    serviceClient: ServiceClientInterface<A>
  ) => ResponseAuthInterceptorType,
  requestInterceptor?: (serviceClient: ServiceClientInterface<A>) => InterceptorType[],
  responseInterceptor?: (serviceClient: ServiceClientInterface<A>) => InterceptorType[]
) {
  return (store: Store) => (next: DispatchNJ) => (action: ActionNJ) => {
    const middleware = new ServiceClient(
      baseUrl,
      store,
      next,
      checkConnectionLost,
      authRequestInterceptor,
      authResponseInterceptor,
      requestInterceptor,
      responseInterceptor
    );
    middleware.executeAction(action, netClientCtor);
  };
}
