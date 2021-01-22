import { ServiceClientInterface } from './base/CommonTypes'
import { NetClientAxios } from './axios/ServiceAxiosNetClient'
import { AxiosError, AxiosResponse } from 'support/network/axios'
import { getClientCredentialsAction, getRefreshedUserCredentialsAction } from '../../services/oauth'
import { getClientAuthHeader, getUserAuthHeader } from '../../services/Auth.Utils'
import ReqIds from '../../services/RequestIds'
import { AxiosNetClientConfig } from './axios/ServiceAxiosNetClient.Types'
import { RootState } from '../../reducers'
import { adaptCallToRedux } from './Redux.Utils'
import { DispatchNJ } from './redux/Types'
import { ServiceCallFromObject } from './redux/ReduxServiceCallAction'
import { GET_WEBVIEW } from '../../services/oauth/RequestIds'
import {
  ADD_NEW_PLACE,
  GET_PLACE_CONFIRMATION,
  GET_PLACE_NAME,
  GET_PLACES,
} from '../../services/wervices/RequestIds'
import {
  GET_COUNTRIES,
  GET_FILTER_REGIONS,
  GET_REGION_NAME,
  GET_REGIONS_BY_COORDS,
} from '../../services/locations/RequestIds'
import { GET_USER_ME, PATCH_USER } from '../../services/users/RequestIds'
import { GET_PROFILE_STEP, PATCH_PROFILE } from '../../services/onboarding/RequestIds'

export const retryWithRefreshToken = (getState: () => RootState, next: DispatchNJ) => (
  serviceClient: ServiceClientInterface<
    RootState,
    NetClientAxios,
    AxiosNetClientConfig,
    AxiosResponse,
    AxiosError
  >,
) => async (error: AxiosError) => {
  const config = error.config as AxiosNetClientConfig
  return new Promise<AxiosResponse>(async function (resolve, reject) {
    if (error.response && error.response.status === 401) {
      if (
        [
          GET_USER_ME,
          GET_WEBVIEW,
          GET_PROFILE_STEP,
          PATCH_PROFILE,
          PATCH_USER,
          GET_COUNTRIES,
          GET_FILTER_REGIONS,
          GET_REGIONS_BY_COORDS,
          GET_PLACES,
          GET_PLACE_CONFIRMATION,
          ADD_NEW_PLACE,
          GET_PLACE_NAME,
          GET_REGION_NAME,
        ].indexOf(config.reqId) !== -1
      ) {
        const onRequestSuccess = async () => {
          const newConfig = {
            ...config,
            headers: {
              ...config.headers,
              ...getUserAuthHeader(getState()),
            },
          }
          try {
            const f = await serviceClient.executeCallWithConfig(newConfig)
            resolve(f)
          } catch (e) {
            reject(e)
          }
        }
        const onRequestError = () => {
          reject(error)
        }
        console.log('---> getRefreshedUserCredentialsAction for ' + config.reqId)
        serviceClient.executeRequest(
          ServiceCallFromObject<RootState, AxiosResponse, AxiosError>(
            adaptCallToRedux(
              getState,
              next,
              getRefreshedUserCredentialsAction(onRequestSuccess, onRequestError),
            ),
          ),
        )
      } else if (
        [ReqIds.POST_NEW_USER, ReqIds.GET_I18N_TRANSLATIONS].indexOf(config.reqId) !== -1
      ) {
        const onRequestSuccess = () => {
          const newConfig = {
            ...config,
            headers: {
              ...config.headers,
              ...getClientAuthHeader(getState()),
            },
          }
          return resolve(serviceClient.executeCallWithConfig(newConfig))
        }
        const onRequestError = () => {
          reject(error)
        }
        console.log('---> getRefreshedUserCredentialsAction for ' + config.reqId)
        serviceClient.executeRequest(
          ServiceCallFromObject<RootState, AxiosResponse, AxiosError>(
            getClientCredentialsAction(onRequestSuccess, onRequestError),
          ),
        )
      } else {
        reject(error)
      }
    } else {
      reject(error)
    }
  })
}
