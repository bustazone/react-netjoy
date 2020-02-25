import { AnyAction } from 'redux';
import { CallObjectInterface } from './ServiceCallAction';
import {
  InterceptorType,
  RequestAuthInterceptorType,
  ResponseAuthInterceptorType,
} from './Interceptors';

export type ActionNJ = AnyAction | CallObjectInterface;

interface Dispatch<A extends ActionNJ = AnyAction> {
  <T extends A>(action: T): T;
}

export type DispatchNJ = Dispatch<ActionNJ>;

export interface NetClientConstructor {
  new (
    baseUrl: string,
    auth: boolean,
    requestInterceptor: InterceptorType[],
    responseInterceptor: InterceptorType[],
    authRequestInterceptor: RequestAuthInterceptorType,
    authResponseInterceptor: ResponseAuthInterceptorType
  ): NetClientInterface;
}

export interface NetClientInterface {
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
