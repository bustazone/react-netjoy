import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { NetClientConfigWithID } from '../base/CommonTypes'

export type AxiosNetClientConfig = AxiosRequestConfig & NetClientConfigWithID<AxiosResponse, AxiosError>
