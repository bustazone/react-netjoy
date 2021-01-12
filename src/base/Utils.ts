import {
  FailureRequestMethodType,
  FailureResponseMethodType,
  NetClientConfigWithID,
  RequestInterceptorType,
  ResponseInterceptorType,
  SuccessRequestMethodType,
  SuccessResponseMethodType,
} from './CommonTypes'

export function createRequestInterceptor<C extends NetClientConfigWithID, E>(
  onSuccess?: SuccessRequestMethodType<C>,
  onFailure?: FailureRequestMethodType<E, C>,
): RequestInterceptorType<C, E> {
  return {
    success: onSuccess,
    error: onFailure,
  }
}

export function createResponseInterceptor<R, E>(
  onSuccess?: SuccessResponseMethodType<R>,
  onFailure?: FailureResponseMethodType<E, R>,
): ResponseInterceptorType<R, E> {
  return {
    success: onSuccess,
    error: onFailure,
  }
}
