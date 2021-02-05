import { GET_DEVICE_STARTED, GET_DEVICE_SUCCESS, GET_DEVICE_FAILURE } from './ActionTypes'
import { GET_DEVICE } from './RequestIds'
import { debug } from 'react-netjoy'

const DEVICE_URL = '/devices'

export function getDeviceRequest(
  deviceUuid: string,
  onSuccess: (response: object) => void = () => {},
  onFailure: (error: object) => void = () => {},
) {
  const serviceCall = debug.getDebugEmptyRequest()
  serviceCall.reqId = GET_DEVICE
  serviceCall.setEndpointFromState = () => `${DEVICE_URL}/${deviceUuid}`
  serviceCall.method = 'GET'
  serviceCall.transformResponseDataWithState = response => {
    console.log('response')
    console.log(response)
  }
  serviceCall.onSuccess = onSuccess
  serviceCall.onFailure = onFailure
  return serviceCall
}

export function getDeviceAction(
  deviceUuid: string,
  onSuccess: (response: object) => void = () => {},
  onFailure: (error: object) => void = () => {},
) {
  const serviceCall = debug.getDebugEmptyRequestAction(getDeviceRequest(deviceUuid, onSuccess, onFailure))
  serviceCall.startedReqType = GET_DEVICE_STARTED
  serviceCall.successReqType = GET_DEVICE_SUCCESS
  serviceCall.failureReqType = GET_DEVICE_FAILURE
  return serviceCall.getAction()
}
