import { axios } from 'react-netjoy'

export const manageError: axios.AxiosInterceptorResponseErrorInputFunctionType<{}> = (error, _serviceClient) => {
  console.log('error')
  console.log(error)
  throw error
}
