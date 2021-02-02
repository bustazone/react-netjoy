import { NetClientConfigWithID, ServiceClientInterface } from '../base/CommonTypes'
import { RequestInterface } from '../base/Request.Types'

export type RequestType<StateType, ResponseType, ErrorType> = {
  call: RequestInterface<StateType, ResponseType, ErrorType>
  cancel?: () => void
}

export type RequestBudgetComponentProps<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = {
  netClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>
}
