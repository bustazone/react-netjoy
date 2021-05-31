import { OutActionFailure, OutActionStarted, OutActionSuccess } from './Types'
import { ReduxRequest, RequestActionFromObject } from './ReduxRequestAction'
import { ReduxActionInterface } from './ReduxRequestAction.Types'
import { RequestInterface } from '../base/Request.Types'
import { Dispatch } from 'redux'
import { NetjoyError, NetjoyResponse } from '../base/CommonTypes'
import { Request } from '../base/Request'

export function adaptRequestFromReduxAction<StateType, DomainResponseType, DomainErrorType>(
  _getState: () => StateType,
  next: Dispatch,
  action: ReduxActionInterface<StateType, DomainResponseType, DomainErrorType>,
): RequestInterface<StateType, DomainResponseType, DomainErrorType> {
  const call = RequestActionFromObject(action)
  call.onStart = () => {
    if (call.startedReqType) {
      const actionStart: OutActionStarted = { type: call.startedReqType }
      next(actionStart)
    }
  }
  const newOnSuccess = (type: string | undefined, method: (response: NetjoyResponse<any, DomainResponseType>) => void) => (
    response: NetjoyResponse<any, DomainResponseType>,
  ) => {
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
  const newOnFailure = (type: string | undefined, method: (error: NetjoyError<any, DomainErrorType>) => void) => (
    error: NetjoyError<any, DomainErrorType>,
  ) => {
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

export function getEmptyRequestAction<State, DomainResponseType, DomainErrorType>(
  req?: Request<State, DomainResponseType, DomainErrorType>,
) {
  return new ReduxRequest<State, DomainResponseType, DomainErrorType>(req)
}
