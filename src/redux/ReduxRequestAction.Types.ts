import { RequestInterface } from '../base/Request.Types'

export const API_CALL = 'API_CALL'

export interface ReduxRequestActionInterface<StateType, ResponseType, ErrorType>
  extends RequestInterface<StateType, ResponseType, ErrorType> {
  startedReqType?: string
  successReqType?: string
  failureReqType?: string
  getAction: () => ReduxActionInterface<StateType, ResponseType, ErrorType>
}

export enum ReduxCallObjectInterfaceType {
  ActionType = 'react-netjoy-action',
}

export interface ReduxActionInterface<StateType, ResponseType, ErrorType> {
  type: ReduxCallObjectInterfaceType.ActionType
  [API_CALL]: Omit<ReduxRequestActionInterface<StateType, ResponseType, ErrorType>, 'getAction'>
}