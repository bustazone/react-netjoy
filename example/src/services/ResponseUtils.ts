import { AxiosError, AxiosResponse } from 'axios'

type NetResponseType = {}
type DomainResponseType = {}
type NetErrorType = {}
type DomainErrorType = {}

export function transformResponse(_response: AxiosResponse<NetResponseType>): DomainResponseType {
  return {}
}

export function transformError(_error: AxiosError<NetErrorType>): DomainErrorType {
  return {}
}
