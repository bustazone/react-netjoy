import { CallInterface } from '../base/ServiceCallAction'

export const API_CALL = 'API_CALL'

export interface ReduxCallInterface<StateType, ResponseType, ErrorType>
  extends CallInterface<StateType, ResponseType, ErrorType> {
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
  [API_CALL]: Omit<ReduxCallInterface<StateType, ResponseType, ErrorType>, 'getAction'>
}
