import { RequestInterface } from './Request.Types'

export class Request<StateType, ResponseType, ErrorType> implements RequestInterface<StateType, ResponseType, ErrorType> {
  reqId: string
  setEndpointFromState?: (state: StateType) => string
  method: string
  setBodyFromState?: (state: StateType) => any
  getHeadersFromState: (state: StateType) => object
  onStart: () => void
  onSuccess: (response: object) => void
  onFailure: (error: object) => void
  onFinish: () => void
  transformResponseDataWithState?: (response: ResponseType, state: StateType) => any
  transformErrorDataWithState?: (error: ErrorType, state: StateType) => any
  debugForcedResponse?: any
  debugForcedError?: any

  constructor() {
    this.reqId = ''
    this.method = 'GET'
    this.getHeadersFromState = () => ({})
    this.onStart = () => {}
    this.onSuccess = () => {}
    this.onFailure = () => {}
    this.onFinish = () => {}
  }
}
