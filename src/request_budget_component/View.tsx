import { Component } from 'react'
import { getNewClient } from 'support/network'
import { CallInterface } from 'support/network/base/ServiceCallAction'
import { NetClientConfigWithID, ServiceClientInterface } from 'support/network/base/CommonTypes'
import { RequestBudgetComponentProps, RequestType } from 'support/network/request_budget_component/View.Types'
import { randomID } from 'support/network/request_budget_component/View.Utils'

class View<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> extends Component<
  RequestBudgetComponentProps<StateType, ConfigType, ResponseType, ErrorType>
> {
  netClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>
  requestList: RequestType<StateType, ResponseType, ErrorType>[] = []

  constructor(props: RequestBudgetComponentProps<StateType, ConfigType, ResponseType, ErrorType>) {
    super(props)
    // Creamos el netclient si no existe
    this.netClient = props.netClient || getNewClient()
  }

  executeRequest(request: CallInterface<StateType, ResponseType, ErrorType>): string {
    // Usamos el netclient para hacer la llamada
    const newRequest = {
      ...request,
      reqId: `${request.reqId}(${randomID()})`,
      onFinish: () => {
        request.onFinish()
        // Borrar request
      },
    }
    const cancel = this.netClient.executeAction(newRequest)
    // y almacenamos
    this.requestList.push({
      call: request,
      cancel,
    })

    return newRequest.reqId
  }

  cancelAllRequests() {
    // cancel all request in the array
    this.requestList.forEach(requestData => {
      if (requestData.cancel) requestData.cancel()
    })
  }

  cancelRequestsByReqId(reqId: string) {
    // cancel all request in the array
    const requestData = this.requestList.find(item => {
      return item.call.reqId === reqId
    })
    if (requestData) {
      if (requestData.cancel) requestData.cancel()
      return
    }
  }

  componentDidMount() {
    if (super.componentDidMount) super.componentDidMount()
  }

  componentWillUnmount() {
    if (super.componentWillUnmount) super.componentWillUnmount()
    // Cancel all associated requests
    this.cancelAllRequests()
  }
}

export default View
