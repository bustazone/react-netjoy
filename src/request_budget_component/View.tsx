import { Component } from 'react'
import { NetClientConfigWithID, ServiceClientInterface } from '../base/CommonTypes'
import { RequestBudgetComponentProps, RequestType } from './View.Types'
import { randomID } from './View.Utils'
import { RequestInterface } from '../base/Request.Types'

class RequestBudgetComponent<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> extends Component<
  RequestBudgetComponentProps<StateType, ConfigType, ResponseType, ErrorType>
> {
  netClient: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType>
  requestList: RequestType<StateType>[] = []

  constructor(props: RequestBudgetComponentProps<StateType, ConfigType, ResponseType, ErrorType>) {
    super(props)
    // Creamos el netclient si no existe
    this.netClient = props.netClient
  }

  executeRequest(request: RequestInterface<StateType, any, any>): string {
    // Usamos el netclient para hacer la llamada
    const newRequest = {
      ...request,
      reqId: `${request.reqId}(${randomID()})`,
      onFinish: () => {
        request.onFinish()
        // Borrar request
      },
    }
    const cancel = this.netClient.executeRequest(newRequest)
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
    // Cancel all associated requests
    this.cancelAllRequests()
    if (super.componentWillUnmount) super.componentWillUnmount()
  }
}

export default RequestBudgetComponent
