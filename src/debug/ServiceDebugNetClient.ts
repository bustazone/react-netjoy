import * as NJTypes from '../base/CommonTypes'
import { DebugError, DebugNetClientConfig, DebugResponse } from './ServiceDebugNetClient.Types'

export class NetClientDebug implements NJTypes.NetClientInterface<DebugResponse> {
  printDebug: boolean
  requestInterceptorList: NJTypes.RequestInterceptorType<DebugNetClientConfig, DebugError>[]
  responseInterceptorList: NJTypes.ResponseInterceptorType<DebugResponse, DebugError>[]

  constructor(
    _baseUrl: string,
    requestInterceptorList: NJTypes.RequestInterceptorType<DebugNetClientConfig, DebugError>[],
    responseInterceptorList: NJTypes.ResponseInterceptorType<DebugResponse, DebugError>[],
    _baseHeaders: { [key: string]: string },
    _timeout: number = 10000,
    printDebug: boolean = false,
  ) {
    this.printDebug = printDebug
    this.requestInterceptorList = requestInterceptorList
    this.responseInterceptorList = responseInterceptorList
  }

  // For intermediate calls
  executeDirectCallWithConfig<T extends DebugNetClientConfig>(config: T): Promise<DebugResponse> {
    return new Promise(resolve => setTimeout(() => resolve({}), config.timeoutMilliseconds || 1000))
  }

  makeCallFromParams(
    reqId: string = '',
    _url: string,
    _method: string,
    _body: string,
    _headers: object,
    onStart: () => void,
    onSuccess: (response: DebugResponse) => void,
    onFailure: (error: DebugError) => void,
    onFinish: () => void,
  ): () => void {
    const config: DebugNetClientConfig = {
      reqId,
      timeoutMilliseconds: 3000,
    }
    onStart()
    // eslint-disable-next-line no-undef
    let timeout: NodeJS.Timer
    new Promise<DebugResponse>(resolve => {
      timeout = setTimeout(() => resolve({}), config.timeoutMilliseconds || 1000)
    })
      .then(response => {
        onSuccess(response)
      })
      .catch(error => {
        onFailure(error)
      })
      .then(() => {
        onFinish()
      })
    // return function to cancel request
    return () => {
      clearTimeout(timeout)
    }
  }
}
