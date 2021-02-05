import { NetClientConfigWithID } from '../base/CommonTypes'

export interface DebugRequestConfig {
  timeoutMilliseconds?: number
}

export type DebugNetClientConfig = DebugRequestConfig & NetClientConfigWithID

export type DebugResponse = {}

export type DebugError = {}
