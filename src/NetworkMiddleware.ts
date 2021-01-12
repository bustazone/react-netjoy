import ServiceClient from './ServiceClient';
import { Action, Middleware, MiddlewareAPI } from 'redux';
import {
  ActionNJ,
  DispatchNJ,
  NetClientConstructor,
  NetClientInterface,
  InterceptorType,
  ServiceClientInterface,
} from './CommonTypes';

export function getServiceClientMiddleware<A extends NetClientInterface>(
  netClientCtor: NetClientConstructor,
  baseUrl: string,
  printDebug: boolean,
  checkConnectionLost?: (dispatch: DispatchNJ) => boolean,
  requestInterceptorList?: (serviceClient: ServiceClientInterface<A>) => InterceptorType[],
  responseInterceptorList?: (serviceClient: ServiceClientInterface<A>) => InterceptorType[]
): Middleware<any, any, DispatchNJ> {
  return (api: MiddlewareAPI<DispatchNJ, any>) => (next: DispatchNJ) => (action: ActionNJ) => {
    const middleware = new ServiceClient(
      baseUrl,
      api,
      next,
      checkConnectionLost,
      requestInterceptorList,
      responseInterceptorList,
      printDebug
    );
    middleware.executeAction(action, netClientCtor);
  };
}

export const loggerMiddleware: Middleware = <S>(api: MiddlewareAPI<DispatchNJ, S>) => (
  next: DispatchNJ
) => <A extends Action>(action: A): A => {
  console.log('Before');
  const result = next(action);
  console.log(api.getState()); // Can use: api.getState()
  console.log('After'); // Can use: api.getState()
  return result;
};
