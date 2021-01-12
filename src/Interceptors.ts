import { FailureMethodType, InterceptorType, SuccessMethodType } from './CommonTypes';

export function createInterceptor(
  onSuccess?: SuccessMethodType,
  onFailure?: FailureMethodType
): InterceptorType {
  return {
    success: onSuccess,
    error: onFailure,
  };
}
