import { DebugForcedResponseType, RequestInterface } from './Request.Types'
import { NetjoyError, NetjoyResponse } from './CommonTypes'

export class Request<StateType, DomainResponseType, DomainErrorType>
  implements RequestInterface<StateType, DomainResponseType, DomainErrorType> {
  reqId: string
  setEndpointFromState?: (state?: StateType) => string
  method: string
  setBodyFromState?: (state?: StateType) => any
  getHeadersFromState: (state?: StateType) => { [key: string]: string }
  onStart: () => void
  onSuccess: (response: NetjoyResponse<any, DomainResponseType>) => void
  onFailure: (error: NetjoyError<any, DomainErrorType>) => void
  onFinish: () => void
  transformResponseDataWithState?: (response: NetjoyResponse, state?: StateType) => DomainResponseType
  transformErrorDataWithState?: (error: NetjoyError, state?: StateType) => DomainErrorType
  debugForcedResponse: DebugForcedResponseType

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
