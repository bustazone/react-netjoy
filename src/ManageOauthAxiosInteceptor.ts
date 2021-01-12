import { RootState } from '../../reducers'
import { AxiosError, AxiosResponse } from 'support/network/axios'
import { ServiceClientInterface } from './base/CommonTypes'
import { NetClientAxios } from './axios/ServiceAxiosNetClient'
import { AxiosNetClientConfig } from './axios/ServiceAxiosNetClient.Types'
import { PATCH_DEVICE } from '../../services/device/RequestIds'
import { GET_CONFIGURATIONS } from '../../services/configuration/RequestIds'
import { PUT_NOTIFICATION_AS_READ } from '../../services/notifications/RequestIds'
import { GET_USER_ME, PATCH_USER, POST_NEW_USER } from '../../services/users/RequestIds'
import {
  GET_COUNTRIES,
  GET_FILTER_REGIONS,
  GET_REGION_NAME,
  GET_REGIONS_BY_COORDS,
} from '../../services/locations/RequestIds'
import {
  GET_PLACES,
  GET_PLACE_CONFIRMATION,
  ADD_NEW_PLACE,
  GET_PLACE_NAME,
} from '../../services/wervices/RequestIds'
import { DispatchNJ } from './redux/Types'
import { GET_RECOVER_PASSWORD, GET_WEBVIEW } from '../../services/oauth/RequestIds'
import { GET_I18N_TRANSLATIONS } from '../../services/i18n/RequestIds'
import { GET_PROFILE_STEP, PATCH_PROFILE } from '../../services/onboarding/RequestIds'

export const manageAuthenticationRequest = (getState: () => RootState, next: DispatchNJ) => (
  serviceClient: ServiceClientInterface<
    RootState,
    NetClientAxios,
    AxiosNetClientConfig,
    AxiosResponse,
    AxiosError
  >,
) => (config: AxiosNetClientConfig) => {
  const userId = (getState() as RootState).data.session.userId
  if (config.reqId === PATCH_DEVICE) {
    if (userId) {
      return setUserAuthHeader(getState, next, serviceClient, config)
    } else {
      return setClientAuthHeader(getState, next, serviceClient, config)
    }
  }
  if (
    [GET_CONFIGURATIONS, POST_NEW_USER, GET_I18N_TRANSLATIONS, GET_RECOVER_PASSWORD].indexOf(
      config.reqId,
    ) !== -1
  ) {
    return setClientAuthHeader(getState, next, serviceClient, config)
  }
  if (
    [
      PUT_NOTIFICATION_AS_READ,
      GET_USER_ME,
      PATCH_USER,
      GET_COUNTRIES,
      GET_FILTER_REGIONS,
      GET_REGIONS_BY_COORDS,
      GET_PLACES,
      GET_PLACE_CONFIRMATION,
      ADD_NEW_PLACE,
      GET_PLACE_NAME,
      GET_WEBVIEW,
      GET_PROFILE_STEP,
      PATCH_PROFILE,
      GET_REGION_NAME,
    ].indexOf(config.reqId) !== -1
  ) {
    return setUserAuthHeader(getState, next, serviceClient, config)
  }
  return config
}

function setClientAuthHeader(
  getState: () => RootState,
  next: DispatchNJ,
  serviceClient: ServiceClientInterface<
    RootState,
    NetClientAxios,
    AxiosNetClientConfig,
    AxiosResponse,
    AxiosError
  >,
  config: AxiosNetClientConfig,
) {
  const clientCredentials = (getState() as RootState).oauth.clientCredentials
  if (!clientCredentials || clientCredentials.access_token === undefined) {
    throw new Error("there's no client credentials")
  }
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `${clientCredentials.token_type} ${clientCredentials.access_token}`,
    },
  }
}

function setUserAuthHeader(
  getState: () => RootState,
  next: DispatchNJ,
  serviceClient: ServiceClientInterface<
    RootState,
    NetClientAxios,
    AxiosNetClientConfig,
    AxiosResponse,
    AxiosError
  >,
  config: AxiosNetClientConfig,
) {
  const userCredentials = (getState() as RootState).oauth.userCredentials
  if (!userCredentials || userCredentials.access_token === undefined) {
    throw new Error("there's no user credentials")
  }
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `${userCredentials.token_type} ${userCredentials.access_token}`,
    },
  }
}
