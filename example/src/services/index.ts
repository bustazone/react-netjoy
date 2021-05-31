import { GET_DEVICE_STARTED, GET_DEVICE_SUCCESS, GET_DEVICE_FAILURE } from './ActionTypes'
import { GET_DEVICE } from './RequestIds'
import { redux, getEmptyRequest } from 'react-netjoy'

const DEBUG_URL = '/debug'

export function getDebugRequest(onSuccess: (response: object) => void = () => {}, onFailure: (error: object) => void = () => {}) {
  const serviceCall = getEmptyRequest()
  serviceCall.reqId = GET_DEVICE
  serviceCall.setEndpointFromState = () => `${DEBUG_URL}`
  serviceCall.method = 'GET'
  serviceCall.onSuccess = onSuccess
  serviceCall.onFailure = onFailure
  return serviceCall
}

export function getDebugAction(onSuccess: (response: object) => void = () => {}, onFailure: (error: object) => void = () => {}) {
  const serviceCall = redux.getEmptyRequestAction(getDebugRequest(onSuccess, onFailure))
  serviceCall.startedReqType = GET_DEVICE_STARTED
  serviceCall.successReqType = GET_DEVICE_SUCCESS
  serviceCall.failureReqType = GET_DEVICE_FAILURE
  return serviceCall.getAction()
}

export function getAxiosRequest(onSuccess: (response: any) => void = () => {}, onFailure: (error: any) => void = () => {}) {
  const serviceCall = getEmptyRequest()
  serviceCall.reqId = GET_DEVICE
  serviceCall.setEndpointFromState = () => 'https://jsonplaceholder.typicode.com/todos/1'
  serviceCall.method = 'GET'
  serviceCall.onSuccess = onSuccess
  serviceCall.onFailure = onFailure
  serviceCall.debugForcedResponse = { debugForced: 'response', debugForcedResponse: { data: { sdfsdf: 'hudhudud' } } }
  return serviceCall
}

export function getAxiosAction(onSuccess: (response: object) => void = () => {}, onFailure: (error: object) => void = () => {}) {
  const serviceCall = redux.getEmptyRequestAction(getAxiosRequest(onSuccess, onFailure))
  serviceCall.startedReqType = GET_DEVICE_STARTED
  serviceCall.successReqType = GET_DEVICE_SUCCESS
  serviceCall.failureReqType = GET_DEVICE_FAILURE
  return serviceCall.getAction()
}
