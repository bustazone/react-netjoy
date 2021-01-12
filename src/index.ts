import { NetClientAxios } from './axios/ServiceAxiosNetClient'
import { getServiceClientMiddleware } from './redux/NetworkMiddleware'
import Config from 'react-native-environmental'
import { connected } from '../connectivity/controller'
import { showErrorView } from '../error_screen/redux/Actions'
import { manageAuthenticationRequest } from './ManageOauthAxiosInteceptor'
import { manageError } from './ManageGeneralErrorsAxiosInterceptor'
import { retryWithRefreshToken } from './ManageRetryWithRefreshTokenAxiosInterceptor'
import { createRequestInterceptor, createResponseInterceptor } from './base/Utils'
import { AxiosError, AxiosResponse } from 'support/network/axios'
import { AxiosNetClientConfig } from './axios/ServiceAxiosNetClient.Types'
import { RootState } from '../../reducers'
import { DispatchNJ } from './redux/Types'
import { manageLanguageRequest } from './ManageLanguageAxiosInteceptor'
import ServiceClient from './base/ServiceClient'
import { store } from '../../store'
import { ReduxServiceCall } from './redux/ReduxServiceCallAction'

export function getNewServiceCall() {
  return new ReduxServiceCall<RootState, AxiosResponse, AxiosError>()
}

export const networkMiddleware = getServiceClientMiddleware<
  RootState,
  AxiosNetClientConfig,
  AxiosResponse,
  AxiosError
>(
  NetClientAxios,
  Config.apiBaseUrl,
  {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  false,
  dispatch => {
    const isConnected = connected
    if (!isConnected) {
      console.log('device is not connected')
      dispatch(showErrorView(true, 'critical_error'))
      return false
    } else {
      console.log('device is connected')
      dispatch(showErrorView(false))
      return true
    }
  },
  (getState: () => RootState, next: DispatchNJ) => (serviceClient: any) => [
    createRequestInterceptor<AxiosNetClientConfig, AxiosError>(
      manageAuthenticationRequest(getState, next)(serviceClient),
      undefined,
    ),
    createRequestInterceptor<AxiosNetClientConfig, AxiosError>(
      manageLanguageRequest(getState, next)(serviceClient),
      undefined,
    ),
  ],
  (getState: () => RootState, next: DispatchNJ) => (serviceClient: any) => [
    createResponseInterceptor<AxiosResponse, AxiosError>(
      undefined,
      retryWithRefreshToken(getState, next)(serviceClient),
    ),
    createResponseInterceptor<AxiosResponse, AxiosError>(
      undefined,
      manageError(getState, next)(serviceClient),
    ),
  ],
)

export function getNewClient() {
  return new ServiceClient(
    NetClientAxios,
    Config.apiBaseUrl,
    store.getState,
    {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    () => {
      const isConnected = connected
      if (!isConnected) {
        console.log('device is not connected')
        store.dispatch(showErrorView(true))
        return false
      } else {
        console.log('device is connected')
        store.dispatch(showErrorView(false))
        return true
      }
    },
    (serviceClient: any) => [
      createRequestInterceptor<AxiosNetClientConfig, AxiosError>(
        manageAuthenticationRequest(store.getState, store.dispatch)(serviceClient),
        undefined,
      ),
      createRequestInterceptor<AxiosNetClientConfig, AxiosError>(
        manageLanguageRequest(store.getState, store.dispatch)(serviceClient),
        undefined,
      ),
    ],
    (serviceClient: any) => [
      createResponseInterceptor<AxiosResponse, AxiosError>(
        undefined,
        retryWithRefreshToken(store.getState, store.dispatch)(serviceClient),
      ),
      createResponseInterceptor<AxiosResponse, AxiosError>(
        undefined,
        manageError(store.getState, store.dispatch)(serviceClient),
      ),
    ],
    false,
  )
}
