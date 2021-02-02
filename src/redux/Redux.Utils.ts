import { DispatchNJ, OutActionFailure, OutActionStarted, OutActionSuccess } from './Types'
import { ServiceCallFromObject } from './ReduxRequestAction'
import { ReduxActionInterface } from './ReduxRequestAction.Types'

export function adaptCallToRedux<StateType, ResponseType, ErrorType>(
  _getState: () => StateType,
  next: DispatchNJ,
  action: ReduxActionInterface<StateType, ResponseType, ErrorType>,
): ReduxActionInterface<StateType, ResponseType, ErrorType> {
  const call = ServiceCallFromObject(action)
  call.onStart = () => {
    if (call.startedReqType) {
      const actionStart: OutActionStarted = { type: call.startedReqType }
      next(actionStart)
    }
  }
  const newOnSuccess = (type: string | undefined, method: (response: object) => void) => (response: object) => {
    if (type) {
      const out: OutActionSuccess<any> = {
        type: type,
        response: response,
      }
      next(out)
    }
    method(response)
  }
  call.onSuccess = newOnSuccess(call.successReqType, call.onSuccess)
  const newOnFailure = (type: string | undefined, method: (error: object) => void) => (error: object) => {
    if (type) {
      const out: OutActionFailure<any> = {
        type: type,
        error: error,
      }
      next(out)
    }
    method(error)
  }
  call.onFailure = newOnFailure(call.failureReqType, call.onFailure)
  return call.getAction()
}
