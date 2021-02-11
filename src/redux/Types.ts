export type OutActionStarted = {
  type: string
}

export type OutActionSuccess<ResponseType> = {
  type: string
  response: ResponseType
}

export type OutActionFailure<ErrorType> = {
  type: string
  error: ErrorType
}
