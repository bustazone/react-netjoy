export const API_CALL = 'API_CALL'

export type DebugForcedResponseType<ResponseType, ErrorType> = {
  debugForced?: 'error' | 'response' | 'disabled'
  debugForcedResponse?: ResponseType | undefined
  debugForcedError?: ErrorType | undefined
}

export interface RequestInterface<StateType, ResponseType, ErrorType> {
  reqId: string
  setEndpointFromState?: (state: StateType) => string
  method: string
  setBodyFromState?: (state: StateType) => string
  getHeadersFromState: (state: StateType) => object
  onStart: () => void
  onSuccess: (response: any) => void
  onFailure: (error: any) => void
  onFinish: () => void
  transformResponseDataWithState?: (response: ResponseType, state: StateType) => any
  transformErrorDataWithState?: (error: ErrorType, state: StateType) => any
  debugForcedResponse: DebugForcedResponseType<Partial<ResponseType>, Partial<ErrorType>>
}
