import RequestBudgetComponent from './request_budget_component/View';


class example<StateType, ConfigType, ResponseType, ErrorType> extends RequestBudgetComponent<StateType, ConfigType, ResponseType, ErrorType> {

  componentDidUpdate(prevProps: Readonly<<StateType, ConfigType, ResponseType, ErrorType>>, prevState: Readonly<{}>, snapshot?: any) {
    const idreq = this.executeRequest()

    this.cancelRequestsByReqId(idreq)
  }

  getClients(): cancelReq {
    const idreq = this.executeRequest()

    return () => {
      this.cancelRequestsByReqId(idreq)
    }
  }

  render() {
    <index getClients={getClients}/>
  }
}

export default example
