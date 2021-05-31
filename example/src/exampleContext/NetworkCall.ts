import { axios } from 'react-netjoy'
import { getAxiosRequest } from '../services'
// import { debug } from 'react-netjoy'
// import { getDebugRequest } from '../services'

function createRequestInterceptors() {
  // const list = new axios.AxiosRequestInterceptorList()
  // list.addInterceptor(
  //   (config, _serviceClient) => {
  //     console.log('interceptor req success 1')
  //     // return config
  //     throw { config: config, message: 'errrrrrrrrorrrrrr' }
  //   },
  //   (error, _serviceClient) => {
  //     console.log('interceptor req error 1')
  //     console.log(error)
  //     throw error
  //   },
  // )
  // list.addInterceptor(
  //   (config, _serviceClient) => {
  //     console.log('interceptor req success 2')
  //     return config
  //   },
  //   (error, _serviceClient) => {
  //     console.log('interceptor req error 2')
  //     console.log(error)
  //     throw error
  //   },
  // )
  // return list.getList()
  return []
}

function createResponseInterceptors() {
  // const list = new axios.AxiosResponseInterceptorList()
  // list.addInterceptor(
  //   (response, _serviceClient) => {
  //     console.log('interceptor resp success 1')
  //     console.log(response)
  //     return response
  //     // throw { config: response.config, message: 'errrrrrrrrorrrrrr' }
  //   },
  //   (error, _serviceClient) => {
  //     console.log('interceptor resp error 1')
  //     console.log(error)
  //     throw error
  //   },
  // )
  // list.addInterceptor(
  //   (response, _serviceClient) => {
  //     console.log('interceptor resp success 2')
  //     console.log(response)
  //     return response
  //   },
  //   (error, _serviceClient) => {
  //     console.log('interceptor resp error 2')
  //     console.log(error)
  //     throw error
  //   },
  // )
  // return list.getList()
  return []
}

export const executeCall = () => {
    const axiosReq = getAxiosRequest(
      response => {
        console.log('response')
        console.log(response)
      },
      error => {
        console.log('error')
        console.log(error)
      },
    )
    console.log('axiosReq')
    console.log(axiosReq)
    const options: axios.GetAxiosNewClientOptionsType<{}> = {
      debugPrint: false,
      requestInterceptorList: createRequestInterceptors,
      responseInterceptorList: createResponseInterceptors,
    }
    axios.getAxiosNewClient('', options).executeRequest(axiosReq)
    // debug
    //   .getDebugNewClient('', () => {}, {}, undefined, undefined, undefined, true)
    //   .executeRequest(
    //     getDebugRequest(
    //       response => {
    //         console.log('response')
    //         console.log(response)
    //       },
    //       error => {
    //         console.log('error')
    //         console.log(error)
    //       },
    //     ),
    //   )
}
