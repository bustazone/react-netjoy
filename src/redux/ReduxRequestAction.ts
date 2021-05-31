import { API_CALL, ReduxActionInterface, ReduxRequestActionInterface, ReduxCallObjectInterfaceLiteral } from './ReduxRequestAction.Types'
import { Request } from '../base/Request'

export class ReduxRequest<StateType, DomainResponseType, DomainErrorType>
  extends Request<StateType, DomainResponseType, DomainErrorType>
  implements ReduxRequestActionInterface<StateType, DomainResponseType, DomainErrorType> {
  startedReqType?: string
  successReqType?: string
  failureReqType?: string

  constructor(req?: Request<StateType, DomainResponseType, DomainErrorType>) {
    super()
    super.reqId = req ? req.reqId : ''
    super.setEndpointFromState = req ? req.setEndpointFromState : undefined
    super.method = req ? req.reqId : 'GET'
    super.setBodyFromState = req ? req.setBodyFromState : undefined
    super.getHeadersFromState = req ? req.getHeadersFromState : () => ({})
    super.onStart = req ? req.onStart : () => {}
    super.onSuccess = req ? req.onSuccess : () => {}
    super.onFailure = req ? req.onFailure : () => {}
    super.onFinish = req ? req.onFinish : () => {}
    super.transformResponseDataWithState = req ? req.transformResponseDataWithState : undefined
    super.transformErrorDataWithState = req ? req.transformErrorDataWithState : undefined
    super.debugForcedResponse = req ? req.debugForcedResponse : { debugForced: 'disabled' }
  }

  getAction = (): ReduxActionInterface<StateType, DomainResponseType, DomainErrorType> => {
    if (this.setEndpointFromState !== undefined) {
      return {
        type: ReduxCallObjectInterfaceLiteral,
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
          debugForcedResponse: this.debugForcedResponse,
        },
      }
    } else {
      throw new Error("You've to specify a function endpoint URL.")
    }
  }
}

export function RequestActionFromObject<StateType, DomainResponseType, DomainErrorType>(
  objectAction: ReduxActionInterface<StateType, DomainResponseType, DomainErrorType>,
): ReduxRequest<StateType, DomainResponseType, DomainErrorType> {
  const object = objectAction[API_CALL]
  if (object === undefined) {
    throw new Error(`The object action in incorrect: ${JSON.stringify(objectAction)}`)
  }
  const request = new ReduxRequest<StateType, DomainResponseType, DomainErrorType>()
  if ('reqId' in object) request.reqId = object.reqId
  if ('setEndpointFromState' in object) request.setEndpointFromState = object.setEndpointFromState
  if ('method' in object) request.method = object.method
  if ('getHeadersFromState' in object) request.getHeadersFromState = object.getHeadersFromState
  if ('startedReqType' in object) request.startedReqType = object.startedReqType
  if ('successReqType' in object) request.successReqType = object.successReqType
  if ('failureReqType' in object) request.failureReqType = object.failureReqType
  if ('setBodyFromState' in object) request.setBodyFromState = object.setBodyFromState
  if ('onStart' in object) request.onStart = object.onStart
  if ('onSuccess' in object) request.onSuccess = object.onSuccess
  if ('onFailure' in object) request.onFailure = object.onFailure
  if ('onFinish' in object) request.onFinish = object.onFinish
  if ('transformResponseDataWithState' in object) request.transformResponseDataWithState = object.transformResponseDataWithState
  if ('transformErrorDataWithState' in object) request.transformErrorDataWithState = object.transformErrorDataWithState
  if ('debugForcedResponse' in object) request.debugForcedResponse = object.debugForcedResponse
  return request
}
