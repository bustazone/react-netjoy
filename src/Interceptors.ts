export type SuccessMethodType = (config: object) => object;
export type FailureMethodType = (error: object) => object;
export type InterceptorType = {
  success?: SuccessMethodType;
  error?: FailureMethodType;
};
export type RequestAuthInterceptorType = SuccessMethodType;
export type ResponseAuthInterceptorType = FailureMethodType;

export function createInterceptor(
  onSuccess?: SuccessMethodType,
  onFailure?: FailureMethodType
): InterceptorType {
  return {
    success: onSuccess,
    error: onFailure,
  };
}
