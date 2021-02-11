import { OutActionFailure, OutActionStarted, OutActionSuccess } from './Types'
import { RequestActionFromObject } from './ReduxRequestAction'
import { ReduxActionInterface } from './ReduxRequestAction.Types'
import { RequestInterface } from '../base/Request.Types'
import { Dispatch } from 'redux'

export function adaptRequestFromReduxAction<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType>(
  _getState: () => StateType,
  next: Dispatch,
  action: ReduxActionInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType>,
): RequestInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType> {
  const call = RequestActionFromObject(action)
  call.onStart = () => {
    if (call.startedReqType) {
      const actionStart: OutActionStarted = { type: call.startedReqType }
      next(actionStart)
    }
  }
  const newOnSuccess = (type: string | undefined, method: (response: DomainResponseType) => void) => (response: DomainResponseType) => {
    if (type) {
      const out: OutActionSuccess<DomainResponseType> = {
        type: type,
        response: response,
      }
      next(out)
    }
    method(response)
  }
  call.onSuccess = newOnSuccess(call.successReqType, call.onSuccess)
  const newOnFailure = (type: string | undefined, method: (error: DomainErrorType) => void) => (error: DomainErrorType) => {
    if (type) {
      const out: OutActionFailure<DomainErrorType> = {
        type: type,
        error: error,
      }
      next(out)
    }
    method(error)
  }
  call.onFailure = newOnFailure(call.failureReqType, call.onFailure)
  return call
}
