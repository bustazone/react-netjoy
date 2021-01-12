import { showErrorView } from '../error_screen/redux/Actions'
import { ServiceClientInterface } from './base/CommonTypes'
import { NetClientAxios } from './axios/ServiceAxiosNetClient'
import { AxiosError, AxiosResponse } from 'support/network/axios'
import { AxiosNetClientConfig } from './axios/ServiceAxiosNetClient.Types'
import { RootState } from '../../reducers'
import { DispatchNJ } from './redux/Types'
import { setLoggedIn } from '../navigation/redux/Actions'
import { sessionReset } from '../../actions/sync/session/Actions'
import { showErrorMessage } from '../snackbar/redux/Actions'
import i18n from '../i18n/controller'

export const manageError = (_getState: () => RootState, next: DispatchNJ) => (
  _serviceClient: ServiceClientInterface<
    RootState,
    NetClientAxios,
    AxiosNetClientConfig,
    AxiosResponse,
    AxiosError
  >,
) => (error: AxiosError) => {
  console.log('error')
  console.log(error)
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response) {
      if (
        error.response.status === 400 ||
        error.response.status === 403 ||
        error.response.status === 404
      ) {
        // serviceClient.executeAction(logoutService(onLogout))
        // console.log(serviceClient.call.reqId)
        console.log(error.response)
        // serviceClient.next(showErrorView(true))
      } else if (error.response.status === 401) {
        console.log(error.response)
        next(setLoggedIn(false))
        next(sessionReset())
        next(showErrorMessage(i18n.t('general_errors.expired_session')))
      } else if (error.response.status >= 500 && error.response.status < 600) {
        console.log(error.response)
        next(showErrorView(true, 'critical_error'))
      } else {
        console.log(error.response)
      }
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // if (error.message && error.message.includes('Network request failed')) {
    //   showConnectivityAlert(serviceClient.next)
    // }
    throw new Error('Error before response:' + JSON.stringify(error))
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error('Unmanaged error:' + JSON.stringify(error))
  }
  console.log(error)
  console.log(error.response)
  throw error
}
