import { AxiosRequestConfig } from 'axios'
import { NetClientConfigWithID } from '../base/CommonTypes'

export type AxiosNetClientConfig = AxiosRequestConfig & NetClientConfigWithID
