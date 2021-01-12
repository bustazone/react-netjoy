import { NetClientConfigWithID, ServiceClientInterface } from 'support/network/base/CommonTypes'
import { CallInterface } from 'support/network/base/ServiceCallAction'

export type RequestType<StateType, ResponseType, ErrorType> = {
  call: CallInterface<StateType, ResponseType, ErrorType>
  cancel?: () => void
}

export type RequestBudgetComponentProps<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> = {
  netClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>
}
