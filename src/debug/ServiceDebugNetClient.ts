import * as NJTypes from '../base/CommonTypes'
import { NetjoyError, NetjoyErrorCodes, NetjoyResponse } from '../base/CommonTypes'
import { DebugError, DebugNetClientConfig, DebugResponse } from './ServiceDebugNetClient.Types'
import { RequestInterceptorType } from '../base/RequestInterceptorUtils.Types'
import { ResponseInterceptorType } from '../base/ResponseInterceptorUtils.Types'
import { DEBUG_CANCELLED_REQUEST_ERROR_CODE } from './Error.Constants'

export class NetClientDebug implements NJTypes.NetClientInterface<DebugResponse, DebugError> {
  debugPrint: boolean
  requestInterceptorList: RequestInterceptorType<DebugNetClientConfig, DebugError>[]
  responseInterceptorList: ResponseInterceptorType<DebugResponse, DebugError>[]

  constructor(
    _baseUrl: string,
    requestInterceptorList: RequestInterceptorType<DebugNetClientConfig, DebugError>[],
    responseInterceptorList: ResponseInterceptorType<DebugResponse, DebugError>[],
    _baseHeaders: { [key: string]: string } = {},
    _timeout: number = 10000,
    debugPrint: boolean = false,
  ) {
    this.debugPrint = debugPrint
    this.requestInterceptorList = requestInterceptorList
    this.responseInterceptorList = responseInterceptorList
  }

  private async executeRequestInterceptorList(config: DebugNetClientConfig): Promise<DebugNetClientConfig> | never {
    let outConfig: DebugNetClientConfig = config
    let outError: DebugError = { config, error: undefined }
    let failure = false
    for (const chain of this.requestInterceptorList) {
      try {
        if (failure) {
          outConfig = chain.error ? await chain.error(outError) : outConfig
        } else {
          outConfig = chain.success ? await chain.success(outConfig) : outConfig
        }
        failure = false
      } catch (e) {
        failure = true
        outError = e
      }
    }
    if (failure) {
      throw outError
    } else {
      return outConfig
    }
  }

  private async executeResponseInterceptorList(
    response: DebugResponse | undefined,
    error: DebugError | undefined,
    initial: boolean,
  ): Promise<DebugResponse> | never {
    const config = response?.config || error?.config
    let outResponse: DebugResponse = response || { config: config!, data: undefined }
    let outError: DebugError = error || { config: config!, error: undefined }
    let failure = initial
    for (const chain of this.responseInterceptorList) {
      try {
        if (failure) {
          outResponse = chain.error && outError ? await chain.error(outError) : outResponse
        } else {
          outResponse = chain.success && outResponse ? await chain.success(outResponse) : outResponse
        }
        failure = false
      } catch (e) {
        failure = true
        outError = e
      }
    }
    if (failure) {
      throw outError
    } else {
      return outResponse
    }
  }

  // For intermediate calls
  executeDirectCallWithConfig<T extends DebugNetClientConfig>(config: T): Promise<DebugResponse> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        if (config.debugForcedResponse) {
          resolve({ config: config, data: config.debugForcedResponse })
        }
        if (config.debugForcedError) {
          reject({ config: config, error: config.debugForcedError })
        }
        resolve({ config: config, data: { value: 'fake data' } })
      }, config.timeoutMilliseconds || 3000),
    )
  }

  makeCallFromParams(
    reqId: string = '',
    _url: string,
    _method: string,
    _body: string,
    _headers: object,
    onStart: () => void,
    onSuccess: (response: NetjoyResponse<DebugResponse>) => void,
    onFailure: (error: NetjoyError<DebugError>) => void,
    onFinish: () => void,
    debugForcedResponse?: any,
    debugForcedError?: any,
  ): () => void {
    const config: DebugNetClientConfig = {
      reqId,
      timeoutMilliseconds: 10000,
      debugForcedResponse,
      debugForcedError,
    }
    onStart()
    // eslint-disable-next-line no-undef
    let timeout: NodeJS.Timer

    // Execute request interceptors
    this.executeRequestInterceptorList(config)
      .then(configx => {
        // Execute request
        new Promise<DebugResponse>((resolve, reject) => {
          timeout = setTimeout(() => {
            if (configx.debugForcedResponse) {
              resolve({ config: configx, data: configx.debugForcedResponse })
            }
            if (configx.debugForcedError) {
              reject({ config: configx, error: configx.debugForcedError })
            }
            resolve({ config: configx, data: { value: 'fake data' } })
          }, configx.timeoutMilliseconds || 3000)
        })
          .then(response => {
            // Execute response interceptors on success
            this.executeResponseInterceptorList(response, undefined, true)
              .then(responsex => {
                onSuccess({ original: responsex, status: 200, domain_data: responsex.data })
              })
              .catch(error => {
                onFailure({ original: error, code: NetjoyErrorCodes.NETJOY_FAILURE_RESPONSE_ERROR_CODE })
              })
              .then(() => {
                onFinish()
              })
          })
          .catch(error => {
            // Execute response interceptors on error
            this.executeResponseInterceptorList(undefined, error, true)
              .then(response => {
                onSuccess({ original: response, status: 200 })
              })
              .catch(errorx => {
                onFailure({ original: errorx, code: NetjoyErrorCodes.NETJOY_FAILURE_RESPONSE_ERROR_CODE })
              })
              .then(() => {
                onFinish()
              })
          })
      })
      .catch(error => {
        this.executeResponseInterceptorList(undefined, error, true)
          .then(response => {
            onSuccess({ original: response, status: 200 })
          })
          .catch(errorx => {
            onFailure({ original: errorx, code: NetjoyErrorCodes.NETJOY_FAILURE_RESPONSE_ERROR_CODE })
            onFailure(errorx)
          })
          .then(() => {
            onFinish()
          })
      })
    // return function to cancel request
    return () => {
      this.executeResponseInterceptorList(
        undefined,
        { error: { code: DEBUG_CANCELLED_REQUEST_ERROR_CODE, error: 'Request Cancelled' } },
        true,
      )
        .then(response => {
          onSuccess({ original: response, status: 200 })
        })
        .catch(error => {
          if (error?.code === 'DEBUG_CANCELLED_REQUEST_ERROR_CODE') return
          onFailure({ original: error, code: NetjoyErrorCodes.NETJOY_CANCEL_ERROR_CODE })
        })
        .then(() => {
          onFinish()
        })
      clearTimeout(timeout)
    }
  }
}
