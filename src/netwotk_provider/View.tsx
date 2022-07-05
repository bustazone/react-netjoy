import React, { Component, PropsWithChildren } from 'react'
import { NetClientConfigWithID, ServiceClientInterface, RequestInterface } from '../base'
import { RequestType } from './View.Types'
import { randomID } from './View.Utils'
import { NetworkContext } from './context'

class NetworkCLientHandler<StateType, ConfigType extends NetClientConfigWithID, ResponseType, ErrorType> extends Component<
  PropsWithChildren<{
    getState: () => StateType
    client: { [key: string]: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType> }
  }>,
  {
    requestList: { [key: string]: RequestType<StateType> }
  }
> {
  constructor(
    props: PropsWithChildren<{
      getState: () => StateType
      clients: { [key: string]: ServiceClientInterface<StateType, ConfigType, ResponseType, ErrorType> }
    }>,
    state: any,
  ) {
    super(props, state)
    this.state = { requestList: {} }
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.cancelAllRequests()
  }

  executeRequest(request: RequestInterface<StateType, any, any>, netClientId: string): string {
    // Usamos el netclient para hacer la llamada
    const newRequest = {
      ...request,
      reqId: `${request.reqId}(${randomID()})`,
      onFinish: () => {
        request.onFinish()
        // Borrar request
      },
    }
    const cancel = this.props.clients[netClientId].executeRequest(newRequest)
    // y almacenamos
    this.setState({
      requestList: {
        ...this.state.requestList,
        [request.reqId]: {
          call: newRequest,
          cancel,
        },
      },
    })

    return newRequest.reqId
  }

  cancelAllRequests() {
    // cancel all request in the array
    Object.values(this.state.requestList).forEach(requestData => {
      if (requestData.cancel) requestData.cancel()
    })
    this.setState({
      requestList: {},
    })
  }

  cancelRequestsByReqId(reqId: string) {
    // cancel all request in the array
    const requestData = this.state.requestList[reqId]
    if (requestData) {
      if (requestData.cancel) requestData.cancel()
      return
    }
  }

  render() {
    return (
      <NetworkContext.Provider
        value={{
          executeRequest: this.executeRequest,
          cancelAllRequests: this.cancelAllRequests,
          cancelRequestsByReqId: this.cancelRequestsByReqId,
        }}
      >
        {this.props.children}
      </NetworkContext.Provider>
    )
  }
}

export default NetworkHandler
