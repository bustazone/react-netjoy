import { NetClientConfigWithID } from '../base/CommonTypes'

export interface DebugRequestConfig {
  timeoutMilliseconds?: number
}

export type DebugNetClientConfig = DebugRequestConfig & NetClientConfigWithID<DebugResponse, DebugError>

export type DebugResponse = {
  config: DebugNetClientConfig
  data: any
}

export type DebugError = {
  config: DebugNetClientConfig
  error: any
}
