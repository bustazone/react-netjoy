import { RootState } from '../../reducers'
import { AxiosError, AxiosResponse } from 'support/network/axios'
import { ServiceClientInterface } from './base/CommonTypes'
import { NetClientAxios } from './axios/ServiceAxiosNetClient'
import { AxiosNetClientConfig } from './axios/ServiceAxiosNetClient.Types'
import { DispatchNJ } from './redux/Types'
import * as RNLocalize from 'react-native-localize'

export const manageLanguageRequest = (getState: () => RootState, _next: DispatchNJ) => (
  _serviceClient: ServiceClientInterface<
    RootState,
    NetClientAxios,
    AxiosNetClientConfig,
    AxiosResponse,
    AxiosError
  >,
) => (config: AxiosNetClientConfig) => {
  return new Promise<AxiosNetClientConfig>(async (resolve, _reject) => {
    let headers = {}
    const codeUrl = (getState() as RootState).data.configuration.code_url
    if (codeUrl && codeUrl !== '') {
      headers = { ...headers, 'X-Code-Url': codeUrl }
    }
    const locales = RNLocalize.getLocales()
    if (locales && locales.length > 0 && locales[0].languageTag) {
      headers = { ...headers, 'X-Locale': locales[0].languageTag }
    }
    resolve({
      ...config,
      headers: {
        ...config.headers,
        ...headers,
      },
    })
  })
}
