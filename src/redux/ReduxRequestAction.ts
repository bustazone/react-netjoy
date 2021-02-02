import { API_CALL, ReduxActionInterface, ReduxRequestActionInterface, ReduxCallObjectInterfaceType } from './ReduxRequestAction.Types'

export class ReduxRequest<StateType, ResponseType, ErrorType> implements ReduxRequestActionInterface<StateType, ResponseType, ErrorType> {
  reqId: string
  startedReqType?: string
  successReqType?: string
  failureReqType?: string
  setEndpointFromState?: (state: StateType) => string
  method: string
  setBodyFromState?: (state: StateType) => any
  getHeadersFromState: (state: StateType) => object
  onStart: () => void
  onSuccess: (response: object) => void
  onFailure: (error: object) => void
  onFinish: () => void
  transformResponseDataWithState?: (response: ResponseType, state: StateType) => any
  transformErrorDataWithState?: (error: ErrorType, state: StateType) => any

  constructor() {
    this.reqId = ''
    this.method = 'GET'
    this.getHeadersFromState = () => ({})
    this.onStart = () => {}
    this.onSuccess = () => {}
    this.onFailure = () => {}
    this.onFinish = () => {}
  }

  getAction = (): ReduxActionInterface<StateType, ResponseType, ErrorType> => {
    if (this.setEndpointFromState !== undefined) {
      return {
        type: ReduxCallObjectInterfaceType.ActionType,
        [API_CALL]: {
          reqId: this.reqId,
          startedReqType: this.startedReqType,
          successReqType: this.successReqType,
          failureReqType: this.failureReqType,
          setEndpointFromState: this.setEndpointFromState,
          method: this.method,
          setBodyFromState: this.setBodyFromState,
          getHeadersFromState: this.getHeadersFromState,
          onStart: this.onStart,
          onSuccess: this.onSuccess,
          onFailure: this.onFailure,
          onFinish: this.onFinish,
          transformResponseDataWithState: this.transformResponseDataWithState,
          transformErrorDataWithState: this.transformErrorDataWithState,
        },
      }
    } else {
      throw new Error("You've to specify a function endpoint URL.")
    }
  }
}

export function ServiceCallFromObject<StateType, ResponseType, ErrorType>(
  objectAction: ReduxActionInterface<StateType, ResponseType, ErrorType>,
): ReduxRequest<StateType, ResponseType, ErrorType> {
  const object = objectAction[API_CALL]
  if (object === undefined) {
    throw new Error(`The object action in incorrect: ${JSON.stringify(objectAction)}`)
  }
  const serviceCall = new ReduxRequest<StateType, ResponseType, ErrorType>()
  if ('reqId' in object) serviceCall.reqId = object.reqId
  if ('setEndpointFromState' in object) serviceCall.setEndpointFromState = object.setEndpointFromState
  if ('method' in object) serviceCall.method = object.method
  if ('getHeadersFromState' in object) serviceCall.getHeadersFromState = object.getHeadersFromState
  if ('startedReqType' in object) serviceCall.startedReqType = object.startedReqType
  if ('successReqType' in object) serviceCall.successReqType = object.successReqType
  if ('failureReqType' in object) serviceCall.failureReqType = object.failureReqType
  if ('setBodyFromState' in object) serviceCall.setBodyFromState = object.setBodyFromState
  if ('onStart' in object) serviceCall.onStart = object.onStart
  if ('onSuccess' in object) serviceCall.onSuccess = object.onSuccess
  if ('onFailure' in object) serviceCall.onFailure = object.onFailure
  if ('onFinish' in object) serviceCall.onFinish = object.onFinish
  if ('transformResponseDataWithState' in object) serviceCall.transformResponseDataWithState = object.transformResponseDataWithState
  if ('transformErrorDataWithState' in object) serviceCall.transformErrorDataWithState = object.transformErrorDataWithState
  return serviceCall
}
