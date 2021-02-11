import { axios } from 'react-netjoy'

export const manageError: axios.AxiosInterceptorResponseErrorInputFunctionType<{}> = (error, _serviceClient) => {
  console.log('error')
  console.log(error)
  throw error
}

export const checkConnection: axios.AxiosInterceptorRequestSuccessInputFunctionType<{}> = (_config, _serviceClient) => {
  const isConnected = connected
  if (!isConnected) {
    console.log('device is not connected')
    store.dispatch(showErrorView(true))
    return false
  } else {
    console.log('device is connected')
    store.dispatch(showErrorView(false))
    return true
  }
  throw error
}
