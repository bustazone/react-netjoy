import axios, { AxiosError, AxiosInstance, AxiosResponse, Method } from 'axios'
import * as NJTypes from '../base/CommonTypes'
import { AxiosNetClientConfig } from './ServiceAxiosNetClient.Types'
import { RequestInterceptorType } from '../base/RequestInterceptorUtils.Types'
import { ResponseInterceptorType } from '../base/ResponseInterceptorUtils.Types'
import { NetjoyError, NetjoyResponse } from '../base/CommonTypes'

export class NetClientAxios implements NJTypes.NetClientInterface<AxiosResponse, AxiosError> {
  debugPrint: boolean
  instance: AxiosInstance
  requestInterceptorList: RequestInterceptorType<AxiosNetClientConfig, AxiosError>[]
  responseInterceptorList: ResponseInterceptorType<AxiosResponse, AxiosError>[]

  constructor(
    baseUrl: string,
    requestInterceptorList: RequestInterceptorType<AxiosNetClientConfig, AxiosError>[],
    responseInterceptorList: ResponseInterceptorType<AxiosResponse, AxiosError>[],
    baseHeaders: { [key: string]: string } = {},
    timeout: number = 10000,
    debugPrint: boolean = false,
  ) {
    this.debugPrint = debugPrint
    this.instance = axios.create({
      baseURL: baseUrl,
      timeout: timeout,
      data: '',
      headers: baseHeaders,
    })
    this.requestInterceptorList = requestInterceptorList
    this.responseInterceptorList = responseInterceptorList

    requestInterceptorList.reverse().forEach((chain: RequestInterceptorType<AxiosNetClientConfig, AxiosError>, index: number) => {
      this.instance.interceptors.request.use(
        async config => {
          const customConfig = config as AxiosNetClientConfig
          if (this.debugPrint) {
            console.log(`[NetJoyBaseAxios] Started ${customConfig.reqId} request success interceptor #${index}`)
          }
          let newConfig = config
          if (chain.success) {
            try {
              newConfig = await chain.success(customConfig)
            } catch (error) {
              if (this.debugPrint) {
                console.log(`[NetJoyBaseAxios] Rejected ${customConfig.reqId} request success interceptor #${index}`)
              }
              if (!error.config) error.config = newConfig
              throw error
            }
            if (this.debugPrint) {
              console.log(`[NetJoyBaseAxios] Resolved ${customConfig.reqId} request success interceptor #${index}`)
            }
            return newConfig
          }
          if (this.debugPrint) {
            console.log(`[NetJoyBaseAxios] No ${customConfig.reqId} request success on interceptor #${index}`)
          }
          return newConfig
        },
        async error => {
          const ff = error.config as AxiosNetClientConfig
          let newConfig = ff
          if (chain.error) {
            if (this.debugPrint) {
              console.log(`[NetJoyBaseAxios] Started ${ff?.reqId || 'unknown'} request failure interceptor #${index}`)
            }
            try {
              newConfig = await chain.error(error)
            } catch (newCatchError) {
              if (this.debugPrint) {
                console.log(`[NetJoyBaseAxios] Rejected ${ff?.reqId || 'unknown'} request failure interceptor #${index}`)
              }
              if (!newCatchError.config) newCatchError.config = newConfig
              throw newCatchError
            }
            if (this.debugPrint) {
              console.log(`[NetJoyBaseAxios] Resolved ${ff?.reqId || 'unknown'} request failure interceptor #${index}`)
            }
            return newConfig
          }
          if (this.debugPrint) {
            console.log(`[NetJoyBaseAxios] No ${ff?.reqId || 'unknown'} request failure on interceptor #${index}`)
          }
          throw error
        },
      )
    })

    this.instance.interceptors.request.use(
      config => {
        const ff = config as AxiosNetClientConfig
        if (ff.debugForcedError || ff.debugForcedResponse) {
          throw { config: config }
        }
        return config
      },
      async (error: AxiosError) => {
        throw error
      },
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      async (error: AxiosError) => {
        const ff = error.config as AxiosNetClientConfig
        if (axios.isCancel(error)) {
          if (this.debugPrint) {
            console.log(`[NetJoyBaseAxios] Request ${ff?.reqId || 'unknown'} cancelled`, error.message)
          }
          return error
        }
        if (ff?.debugForcedError) {
          const eOut = ff.debugForcedError
          eOut.config = error.config
          throw eOut
        }
        if (ff?.debugForcedResponse) {
          return { ...error, ...ff.debugForcedResponse }
        }
        throw error
      },
    )

    responseInterceptorList.forEach((chain: ResponseInterceptorType<AxiosResponse, AxiosError>, index: number) => {
      this.instance.interceptors.response.use(
        async (response: AxiosResponse) => {
          const ff = response.config as AxiosNetClientConfig
          let newResponse: AxiosResponse = response
          if (chain.success) {
            if (this.debugPrint) {
              console.log(`[NetJoyBaseAxios] Started ${ff?.reqId || 'unknown'} response success interceptor #${index}`)
            }
            try {
              newResponse = await chain.success(response)
            } catch (error) {
              if (this.debugPrint) {
                console.log(`[NetJoyBaseAxios] Rejected ${ff?.reqId || 'unknown'} response success interceptor #${index}`)
              }
              if (!error.response) error.response = newResponse
              throw error
            }
            if (this.debugPrint) {
              console.log(`[NetJoyBaseAxios] Resolved ${ff?.reqId || 'unknown'} response success interceptor #${index}`)
            }
            return newResponse
          }
          if (this.debugPrint) {
            console.log(`[NetJoyBaseAxios] No ${ff?.reqId || 'unknown'} response success on interceptor #${index}`)
          }
          return newResponse
        },
        async error => {
          const ff = error.config as AxiosNetClientConfig
          let newResponse
          if (chain.error) {
            if (this.debugPrint) {
              console.log(`[NetJoyBaseAxios] Started ${ff?.reqId || 'unknown'} response failure interceptor #${index}`)
            }
            try {
              newResponse = await chain.error(error)
            } catch (newCatchError) {
              if (this.debugPrint) {
                console.log(`[NetJoyBaseAxios] Rejected ${ff?.reqId || 'unknown'} response failure interceptor #${index}`)
              }
              if (!newCatchError.response) newCatchError.response = newResponse
              throw newCatchError
            }
            if (this.debugPrint) {
              console.log(`[NetJoyBaseAxios] Resolved ${ff?.reqId || 'unknown'} response failure interceptor #${index}`)
            }
            return newResponse
          }
          if (this.debugPrint) {
            console.log(`[NetJoyBaseAxios] No ${ff?.reqId || 'unknown'} response failure in interceptor #${index}`)
          }
          throw error
        },
      )
    })
  }

  // For intermediate calls
  executeDirectCallWithConfig<T extends AxiosNetClientConfig>(config: T): Promise<AxiosResponse> | never {
    return axios.request(config)
  }

  makeCallFromParams(
    reqId: string = '',
    url: string,
    method: string,
    body: string,
    headers: object,
    onStart: () => void,
    onSuccess: (response: NetjoyResponse<AxiosResponse>) => void,
    onFailure: (error: NetjoyError<AxiosError>) => void,
    onFinish: () => void,
    debugForcedResponse?: any,
    debugForcedError?: any,
  ): () => void {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const config: AxiosNetClientConfig = {
      url,
      method: <Method>method,
      data: body,
      headers,
      reqId,
      debugForcedResponse,
      debugForcedError,
      cancelToken: source.token,
    }
    if (this.debugPrint) {
      console.log(`[NetJoyBaseAxios] Starting call ${config.reqId}:\n${JSON.stringify(config)}`)
    }

    onStart()
    this.instance(config)
      .then(response => {
        if (this.debugPrint) {
          console.log(`[NetJoyBaseAxios] Successfully call ${config.reqId}:\n${JSON.stringify(response)}`)
        }
        onSuccess({ _original: response, status: response.status, config: response.config as AxiosNetClientConfig, data: response.data })
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          return
        }
        if (this.debugPrint) {
          console.log(`[NetJoyBaseAxios] Failing call ${config.reqId}:\n${JSON.stringify(error)}`)
        }
        onFailure({ _original: error, code: error.code, error })
      })
      .then(() => {
        onFinish()
      })
    // return function to cancel request
    return () => {
      source.cancel()
    }
  }
}
