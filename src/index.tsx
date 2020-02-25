import { DispatchNJ } from './CommonTypes';
import { ServiceClientInterface } from './ServiceClient';
import {
  InterceptorType,
  RequestAuthInterceptorType,
  ResponseAuthInterceptorType,
} from './Interceptors';
import { getServiceClientMiddleware } from './NetworkMiddleware';
import { NetClientAxios } from './ServiceAxiosNetClient';

function getServiceClientAxiosMiddleware(
  baseUrl: string,
  checkConnectionLost?: (dispatch: DispatchNJ) => void,
  authRequestInterceptor?: (
    serviceClient: ServiceClientInterface<NetClientAxios>
  ) => RequestAuthInterceptorType,
  authResponseInterceptor?: (
    serviceClient: ServiceClientInterface<NetClientAxios>
  ) => ResponseAuthInterceptorType,
  requestInterceptor?: (serviceClient: ServiceClientInterface<NetClientAxios>) => InterceptorType[],
  responseInterceptor?: (serviceClient: ServiceClientInterface<NetClientAxios>) => InterceptorType[]
) {
  return getServiceClientMiddleware(
    NetClientAxios,
    baseUrl,
    checkConnectionLost,
    authRequestInterceptor,
    authResponseInterceptor,
    requestInterceptor,
    responseInterceptor
  );
}

export default getServiceClientAxiosMiddleware;
