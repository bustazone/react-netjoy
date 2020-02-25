import { ServiceCallFromObject } from '../ServiceCallAction'

export function repeatAction(attempts, originalAction, first = true) {
  return dispatch => {
    const newAttempts = attempts - 1
    let newAction = ServiceCallFromObject(originalAction)
    if (newAttempts > 1) {
      if (!first) {
        newAction.startedReqType = undefined
      }
      newAction.failureReqType = undefined
      newAction.onFailure = () => {
        dispatch(repeatAction(newAttempts, originalAction, false))
      }
    } else {
      newAction = ServiceCallFromObject(originalAction)
      newAction.startedReqType = undefined
    }
    dispatch(newAction.getAction())
  }
}
