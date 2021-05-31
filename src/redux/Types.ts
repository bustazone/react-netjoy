import { NetjoyError, NetjoyResponse } from '../base/CommonTypes'

export type OutActionStarted = {
  type: string
}

export type OutActionSuccess<ResponseType> = {
  type: string
  response: NetjoyResponse<any, ResponseType>
}

export type OutActionFailure<ErrorType> = {
  type: string
  error: NetjoyError<any, ErrorType>
}
