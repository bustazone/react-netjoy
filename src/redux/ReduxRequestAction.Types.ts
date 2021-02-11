import { RequestInterface } from '../base/Request.Types'

export const API_CALL = 'API_CALL'

export const ReduxCallObjectInterfaceLiteral = 'react-netjoy-action'

export interface ReduxRequestActionInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType>
  extends RequestInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType> {
  startedReqType?: string
  successReqType?: string
  failureReqType?: string
  getAction: () => ReduxActionInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType>
}

export interface ReduxActionInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType> {
  type: typeof ReduxCallObjectInterfaceLiteral
  [API_CALL]: Omit<ReduxRequestActionInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType>, 'getAction'>
}
