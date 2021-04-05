import { RequestInterface } from './Request.Types'
import { NetClientConstructor, NetClientInterface, ServiceClientInterface, NetClientConfigWithID } from './CommonTypes'
import { RequestInterceptorListType } from './RequestInterceptorUtils.Types'
import { ResponseInterceptorListType } from './ResponseInterceptorUtils.Types'

class ServiceClient<StateType, ConfigType extends NetClientConfigWithID<ResponseType, ErrorType>, ResponseType, ErrorType>
  implements ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType> {
  getState: () => StateType
  debugPrint: boolean
  netClient: NetClientInterface<ResponseType, ErrorType>

  constructor(
    netClientCtor: NetClientConstructor<ConfigType, ResponseType, ErrorType>,
    baseUrl: string,
    getState: () => StateType,
    baseHeaders: { [key: string]: string },
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

  onInnerSuccess = <DomainResponseType, DomainErrorType>(
    req: RequestInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType>,
  ) => (response: ResponseType) => {
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final response before transformation: ', response)
    }
    let transformedResponse: DomainResponseType
    if (req.transformResponseDataWithState) {
      transformedResponse = req.transformResponseDataWithState(response, this.getState())
    } else {
      transformedResponse = <DomainResponseType>(<unknown>response)
    }
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final response after transformation: ', transformedResponse)
    }
    if (req.onSuccess) {
      req.onSuccess(transformedResponse)
    }
  }

  onInnerFailure = <DomainResponseType, DomainErrorType>(
    req: RequestInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType>,
  ) => (error: ErrorType) => {
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final error before transformation: ', error)
    }
    let transformedError: DomainErrorType
    if (req.transformErrorDataWithState) {
      transformedError = req.transformErrorDataWithState(error, this.getState())
    } else {
      transformedError = <DomainErrorType>(<unknown>error)
    }
    if (this.debugPrint) {
      console.log('[NetJoyBase] Final error after transformation: ', transformedError)
    }
    if (req.onFailure) {
      req.onFailure(transformedError)
    }
  }

  onInnerFinish = <DomainResponseType, DomainErrorType>(
    req: RequestInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType>,
  ) => () => {
    if (req.onFinish) {
      req.onFinish()
    }
  }

  executeDirectCallWithConfig<T extends NetClientConfigWithID<ResponseType, ErrorType>>(config: T): Promise<ResponseType> {
    return this.netClient.executeDirectCallWithConfig<T>(config)
  }

  executeRequest<DomainResponseType, DomainErrorType>(
    req: RequestInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType>,
  ) {
    let body = ''
    if (req.setBodyFromState) {
      body = req.setBodyFromState(this.getState())
    }

    if (this.debugPrint) {
      console.log(`[NetJoyBase] Started req ${req.reqId} : ${JSON.stringify(req)}`)
    }

    // Select debug mode response
    let debugForcedResponse: Partial<ResponseType> | undefined
    let debugForcedError: Partial<ErrorType> | undefined
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
      req.setEndpointFromState!(this.getState()),
      req.method,
      body,
      req.getHeadersFromState(this.getState()),
      req.onStart,
      this.onInnerSuccess(req),
      this.onInnerFailure(req),
      this.onInnerFinish(req),
      debugForcedResponse,
      debugForcedError,
    )
  }
}

export default ServiceClient
