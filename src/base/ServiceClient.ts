import { RequestInterface } from './Request.Types'
import {
  NetClientConstructor,
  NetClientInterface,
  ServiceClientInterface,
  NetClientConfigWithID,
  NetjoyResponse,
  NetjoyError,
} from './CommonTypes'
import { RequestInterceptorListType } from './RequestInterceptorUtils.Types'
import { ResponseInterceptorListType } from './ResponseInterceptorUtils.Types'

class ServiceClient<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType>
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

  onInnerSuccess = <DomainResponseType, DomainErrorType>(req: RequestInterface<StateType, DomainResponseType, DomainErrorType>) => (
    response: NetjoyResponse<ResponseType, DomainResponseType>,
  ) => {
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final response before transformation: ', response)
    }
    let transformedResponseData: DomainResponseType
    if (req.transformResponseDataWithState) {
      transformedResponseData = req.transformResponseDataWithState(response, this.getState ? this.getState() : undefined)
    } else {
      transformedResponseData = <DomainResponseType>(<unknown>response.data)
    }
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final response after transformation: ', transformedResponseData)
    }
    if (req.onSuccess) {
      req.onSuccess({ ...response, data: transformedResponseData })
    }
  }

  onInnerFailure = <DomainResponseType, DomainErrorType>(req: RequestInterface<StateType, DomainResponseType, DomainErrorType>) => (
    error: NetjoyError<ErrorType, DomainErrorType>,
  ) => {
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final error before transformation: ', error)
    }
    let transformedError: DomainErrorType
    if (req.transformErrorDataWithState) {
      transformedError = req.transformErrorDataWithState(error, this.getState ? this.getState() : undefined)
    } else {
      transformedError = <DomainErrorType>(<unknown>error)
    }
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final error after transformation: ', transformedError)
    }
    if (req.onFailure) {
      req.onFailure({ ...error, error: transformedError })
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

  executeRequest<DomainResponseType, DomainErrorType>(
    req: RequestInterface<StateType, DomainResponseType, DomainErrorType>,
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
      debugForcedResponse,
      debugForcedError,
    )
  }

  executeLastestQueue: { [key: string]: () => void } = {}

  executeLastestRequest<DomainResponseType, DomainErrorType>(
    req: RequestInterface<StateType, DomainResponseType, DomainErrorType>,
    sequenceId?: string,
  ): (() => void) | undefined {
    const actualSequenceId = sequenceId || req.reqId
    if (this.executeLastestQueue[actualSequenceId]) this.executeLastestQueue[actualSequenceId]()
    req.onFinish = () => {
      delete this.executeLastestQueue[actualSequenceId]
      req.onFinish()
    }
    const cancelReq = this.executeRequest(req)
    if (cancelReq) {
      this.executeLastestQueue[actualSequenceId] = cancelReq
    }
    return cancelReq
  }
}

export default ServiceClient
