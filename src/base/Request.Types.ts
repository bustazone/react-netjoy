export const API_CALL = 'API_CALL'

export type DebugForcedResponseType<ResponseType, ErrorType> = {
  debugForced?: 'error' | 'response' | 'disabled'
  debugForcedResponse?: ResponseType | undefined
  debugForcedError?: ErrorType | undefined
}

export interface RequestInterface<StateType, ResponseType, ErrorType, DomainResponseType, DomainErrorType> {
  reqId: string
  setEndpointFromState?: (state: StateType) => string
  method: string
  setBodyFromState?: (state: StateType) => string
  getHeadersFromState: (state: StateType) => { [key: string]: string }
  onStart: () => void
  onSuccess: (response: DomainResponseType) => void
  onFailure: (error: DomainErrorType) => void
  onFinish: () => void
  transformResponseDataWithState?: (response: ResponseType, state: StateType) => DomainResponseType
  transformErrorDataWithState?: (error: ErrorType, state: StateType) => DomainErrorType
  debugForcedResponse: DebugForcedResponseType<Partial<ResponseType>, Partial<ErrorType>>
}
