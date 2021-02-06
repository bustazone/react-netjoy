import { GET_DEVICE_STARTED, GET_DEVICE_SUCCESS, GET_DEVICE_FAILURE } from './ActionTypes'
import { GET_DEVICE } from './RequestIds'
import { axios, debug } from 'react-netjoy'

const DEBUG_URL = '/debug'

export function getDebugRequest(onSuccess: (response: object) => void = () => {}, onFailure: (error: object) => void = () => {}) {
  const serviceCall = debug.getDebugEmptyRequest()
  serviceCall.reqId = GET_DEVICE
  serviceCall.setEndpointFromState = () => `${DEBUG_URL}`
  serviceCall.method = 'GET'
  serviceCall.onSuccess = onSuccess
  serviceCall.onFailure = onFailure
  return serviceCall
}

export function getDebugAction(onSuccess: (response: object) => void = () => {}, onFailure: (error: object) => void = () => {}) {
  const serviceCall = debug.getDebugEmptyRequestAction(getDebugRequest(onSuccess, onFailure))
  serviceCall.startedReqType = GET_DEVICE_STARTED
  serviceCall.successReqType = GET_DEVICE_SUCCESS
  serviceCall.failureReqType = GET_DEVICE_FAILURE
  return serviceCall.getAction()
}

export function getAxiosRequest(onSuccess: (response: object) => void = () => {}, onFailure: (error: object) => void = () => {}) {
  const serviceCall = axios.getAxiosEmptyRequest()
  serviceCall.reqId = GET_DEVICE
  serviceCall.setEndpointFromState = () => 'https://jsonplaceholder.typicode.com/todos/1'
  serviceCall.method = 'GET'
  serviceCall.onSuccess = onSuccess
  serviceCall.onFailure = onFailure
  serviceCall.debugForcedResponse = { dfff: 'forced response' }
  return serviceCall
}

export function getAxiosAction(onSuccess: (response: object) => void = () => {}, onFailure: (error: object) => void = () => {}) {
  const serviceCall = axios.getAxiosEmptyRequestAction(getAxiosRequest(onSuccess, onFailure))
  serviceCall.startedReqType = GET_DEVICE_STARTED
  serviceCall.successReqType = GET_DEVICE_SUCCESS
  serviceCall.failureReqType = GET_DEVICE_FAILURE
  return serviceCall.getAction()
}
