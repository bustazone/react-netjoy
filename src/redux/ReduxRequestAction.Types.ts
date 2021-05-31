import { RequestInterface } from '../base/Request.Types'

export const API_CALL = 'API_CALL'

export const ReduxCallObjectInterfaceLiteral = 'react-netjoy-action'

export interface ReduxRequestActionInterface<StateType, DomainResponseType, DomainErrorType>
  extends RequestInterface<StateType, DomainResponseType, DomainErrorType> {
  startedReqType?: string
  successReqType?: string
  failureReqType?: string
  getAction: () => ReduxActionInterface<StateType, DomainResponseType, DomainErrorType>
}

export interface ReduxActionInterface<StateType, DomainResponseType, DomainErrorType> {
  type: typeof ReduxCallObjectInterfaceLiteral
  [API_CALL]: Omit<ReduxRequestActionInterface<StateType, DomainResponseType, DomainErrorType>, 'getAction'>
}
