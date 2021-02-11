import { DebugForcedResponseType, RequestInterface } from './Request.Types'

export class Request<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType>
  implements RequestInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType> {
  reqId: string
  setEndpointFromState?: (state: StateType) => string
  method: string
  setBodyFromState?: (state: StateType) => any
  getHeadersFromState: (state: StateType) => { [key: string]: string }
  onStart: () => void
  onSuccess: (response: DomainResponseType) => void
  onFailure: (error: DomainErrorType) => void
  onFinish: () => void
  transformResponseDataWithState?: (response: ResponseType, state: StateType) => DomainResponseType
  transformErrorDataWithState?: (error: ErrorType, state: StateType) => DomainErrorType
  debugForcedResponse: DebugForcedResponseType<Partial<ResponseType>, Partial<ErrorType>>

  constructor() {
    this.reqId = ''
    this.method = 'GET'
    this.getHeadersFromState = () => ({})
    this.onStart = () => {}
    this.onSuccess = () => {}
    this.onFailure = () => {}
    this.onFinish = () => {}
    this.debugForcedResponse = { debugForced: 'disabled' }
  }
}
