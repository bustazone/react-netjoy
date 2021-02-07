import { RequestInterface } from '../base/Request.Types'

export const API_CALL = 'API_CALL'

export const ReduxCallObjectInterfaceLiteral = 'react-netjoy-action'

export interface ReduxRequestActionInterface<StateType, ResponseType, ErrorType>
  extends RequestInterface<StateType, ResponseType, ErrorType> {
  startedReqType?: string
  successReqType?: string
  failureReqType?: string
  getAction: () => ReduxActionInterface<StateType, ResponseType, ErrorType>
}

export interface ReduxActionInterface<StateType, ResponseType, ErrorType> {
  type: typeof ReduxCallObjectInterfaceLiteral
  [API_CALL]: Omit<ReduxRequestActionInterface<StateType, ResponseType, ErrorType>, 'getAction'>
}
