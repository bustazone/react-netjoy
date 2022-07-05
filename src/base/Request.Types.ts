import { NetjoyError, NetjoyResponse } from './CommonTypes'

export const API_CALL = 'API_CALL'

export type DebugForcedResponseType = {
  debugForced?: 'error' | 'response' | 'disabled'
  debugForcedResponse?: any
  debugForcedError?: any
}

export interface RequestInterface<StateType, DomainResponseType, DomainErrorType> {
  reqId: string
  setEndpointFromState?: (state?: StateType) => string
  method: string
  setBodyFromState?: (state?: StateType) => string
  getHeadersFromState: (state?: StateType) => { [key: string]: string }
  onStart: () => void
  onSuccess: (response: DomainResponseType) => void
  onFailure: (error: DomainErrorType) => void
  onFinish: () => void
  transformResponseDataWithState?: (response: NetjoyResponse, state?: StateType) => DomainResponseType
  transformErrorDataWithState?: (error: NetjoyError, state?: StateType) => DomainErrorType
  debugForcedResponse: DebugForcedResponseType
}
