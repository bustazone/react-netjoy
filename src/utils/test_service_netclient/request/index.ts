import { base } from 'react-netjoy'

export function delayReq(onSuccess?: (res: any) => void, onFailure?: (error: any) => void) {
  const url = `/films/delay/`
  const req = new base.Request()
  req.setEndpointFromState = () => url
  req.method = 'GET'
  req.transformResponseDataWithState = res => {
    console.log(res)
  }
  req.transformErrorDataWithState = error => {
    console.log('transformErrorDataWithState')
    console.log(error)
    return error
  }
  if (onSuccess) req.onSuccess = onSuccess
  if (onFailure) req.onFailure = onFailure
  req.onFinish = () => {
    console.log('-----------------------------> Finish')
  }
  return req
}
