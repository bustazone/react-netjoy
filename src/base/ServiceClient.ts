import { RequestInterface } from './Request.Types'
import {
  NetClientConfigWithID,
  NetClientConstructor,
  NetClientInterface,
  NetjoyError,
  NetjoyErrorCodes,
  NetjoyResponse,
  ServiceClientInterface,
} from './CommonTypes'
import { RequestInterceptorListType } from './RequestInterceptorUtils.Types'
import { ResponseInterceptorListType } from './ResponseInterceptorUtils.Types'

export class ServiceClient<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>
  implements ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType> {
  getState?: () => StateType
  debugPrint: boolean
  netClient: NetClientInterface<ResponseType, ErrorType>

  constructor(
    netClientCtor: NetClientConstructor<ConfigType, ResponseType, ErrorType>,
    baseUrl: string,
    getState: (() => StateType) | undefined,
    baseHeaders: { [key: string]: string } = {},
    requestInterceptorList: RequestInterceptorListType<StateType, ConfigType, ResponseType, ErrorType> = () => [],
    responseInterceptorList: ResponseInterceptorListType<StateType, ConfigType, ResponseType, ErrorType> = () => [],
    debugPrint: boolean = false,
    timeoutMillis?: number,
  ) {
    this.getState = getState
    this.debugPrint = debugPrint
    this.netClient = new netClientCtor(
      baseUrl,
      requestInterceptorList(this),
      responseInterceptorList(this),
      baseHeaders,
      timeoutMillis,
      debugPrint,
    )
  }

  onInnerSuccess = <DomainResponseType = any, DomainErrorType = any>(
    req: RequestInterface<StateType, DomainResponseType, DomainErrorType>,
  ) => (response: NetjoyResponse<ResponseType, DomainResponseType>) => {
    try {
      if (this.debugPrint) {
        console.log('[NetJoyBase] Final response before transformation: ', response)
      }
      let transformedResponseData: DomainResponseType
      if (req.transformResponseDataWithState) {
        transformedResponseData = req.transformResponseDataWithState(response, this.getState ? this.getState() : undefined)
      } else {
        transformedResponseData = response as any
      }
      if (this.debugPrint) {
        console.log('[NetJoyBase] Final response after transformation: ', transformedResponseData)
      }
      if (req.onSuccess) {
        req.onSuccess(transformedResponseData)
      }
    } catch (e) {
      if (this.debugPrint) {
        console.error('[NetJoyBase] Error transforming success response: ' + e)
      }
      if (req.onFailure) {
        req.onFailure({ code: NetjoyErrorCodes.NETJOY_UNHANDLED_ERROR_CODE, original: e } as any)
      }
    }
  }

  onInnerFailure = <DomainResponseType = any, DomainErrorType = any>(
    req: RequestInterface<StateType, DomainResponseType, DomainErrorType>,
  ) => (error: NetjoyError<ErrorType, DomainErrorType>) => {
    try {
      if (this.debugPrint) {
        console.log('[NetJoyBase] Final error before transformation: ', error)
      }
      let transformedError: DomainErrorType
      if (req.transformErrorDataWithState) {
        transformedError = req.transformErrorDataWithState(error, this.getState ? this.getState() : undefined)
      } else {
        transformedError = error as any
      }
      if (this.debugPrint) {
        console.log('[NetJoyBase] Final error after transformation: ', transformedError)
      }
      if (req.onFailure) {
        req.onFailure(transformedError)
      }
    } catch (e) {
      if (this.debugPrint) {
        console.error('[NetJoyBase] Error transforming error response: ' + e)
      }
      if (req.onFailure) {
        req.onFailure({ code: NetjoyErrorCodes.NETJOY_UNHANDLED_ERROR_CODE, original: e } as any)
      }
    }
  }

  onInnerFinish = <DomainResponseType, DomainErrorType>(req: RequestInterface<StateType, DomainResponseType, DomainErrorType>) => () => {
    if (req.onFinish) {
      req.onFinish()
    }
  }

  executeDirectCallWithConfig<T extends NetClientConfigWithID>(config: T): Promise<ResponseType> {
    return this.netClient.executeDirectCallWithConfig<T>(config)
  }

  private executeRequestAux<DomainResponseType, DomainErrorType>(
    req: RequestInterface<StateType, DomainResponseType, DomainErrorType>,
    onCancel: () => void = () => {},
  ): (() => void) | undefined {
    let body = ''
    if (req.setBodyFromState) {
      body = req.setBodyFromState(this.getState ? this.getState() : undefined)
    }

    if (this.debugPrint) {
      console.log(`[NetJoyBase] Started req ${req.reqId} : ${JSON.stringify(req)}`)
    }

    // Select debug mode response
    let debugForcedResponse: NetjoyResponse<ResponseType, DomainResponseType> | undefined
    let debugForcedError: NetjoyError<ErrorType, DomainErrorType> | undefined
    if (req.debugForcedResponse?.debugForced) {
      if (req.debugForcedResponse?.debugForced === 'error') {
        debugForcedError = req.debugForcedResponse?.debugForcedError
      } else if (req.debugForcedResponse?.debugForced === 'response') {
        debugForcedResponse = req.debugForcedResponse?.debugForcedResponse
      }
    }

    // Execute the call
    return this.netClient.makeCallFromParams(
      req.reqId,
      req.setEndpointFromState!(this.getState ? this.getState() : undefined),
      req.method,
      body,
      req.getHeadersFromState(this.getState ? this.getState() : undefined),
      req.onStart,
      this.onInnerSuccess(req),
      this.onInnerFailure(req),
      this.onInnerFinish(req),
      onCancel,
      debugForcedResponse,
      debugForcedError,
    )
  }

  executeRequest<DomainResponseType, DomainErrorType>(
    req: RequestInterface<StateType, DomainResponseType, DomainErrorType>,
  ): (() => void) | undefined {
    return this.executeRequestAux(req)
  }

  executeLastestQueue: { [key: string]: () => void } = {}

  executeLastestRequest<DomainResponseType, DomainErrorType>(
    req: RequestInterface<StateType, DomainResponseType, DomainErrorType>,
    sequenceId?: string,
  ): (() => void) | undefined {
    const actualSequenceId = sequenceId || req.reqId
    if (this.executeLastestQueue[actualSequenceId]) this.executeLastestQueue[actualSequenceId]()
    const onCancel = () => {
      delete this.executeLastestQueue[actualSequenceId]
    }
    const cancelReq = this.executeRequestAux(req, onCancel)
    if (cancelReq) {
      this.executeLastestQueue[actualSequenceId] = cancelReq
    }
    return cancelReq
  }
}
