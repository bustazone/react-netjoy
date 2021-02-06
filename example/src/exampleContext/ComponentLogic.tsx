import React, { FunctionComponent, useContext } from 'react'
import { Context, ContextDataType } from './Handler'
import { Context2, Context2DataType } from './Handler2'
import ExampComp from './Compoenent'
import { debug, axios } from 'react-netjoy'
import { getAxiosRequest, getDebugRequest } from '../services'

export const mapProps = (ownProps: mapPropsI): { data: string; info: string } => ({
  data: ownProps.data,
  info: ownProps.info2,
})

function createRequestInterceptors() {
  const list = new axios.AxiosRequestInterceptorList()
  list.addInterceptor(
    (config, _serviceClient) => {
      console.log('interceptor req success 1')
      // return config
      throw { config: config, message: 'errrrrrrrrorrrrrr' }
    },
    (error, _serviceClient) => {
      console.log('interceptor req error 1')
      console.log(error)
      throw error
    },
  )
  list.addInterceptor(
    (config, _serviceClient) => {
      console.log('interceptor req success 2')
      return config
    },
    (error, _serviceClient) => {
      console.log('interceptor req error 2')
      console.log(error)
      throw error
    },
  )
  return list.getList()
}

function createResponseInterceptors() {
  const list = new axios.AxiosResponseInterceptorList()
  list.addInterceptor(
    (response, _serviceClient) => {
      console.log('interceptor resp success 1')
      console.log(response)
      return response
      // throw { config: response.config, message: 'errrrrrrrrorrrrrr' }
    },
    (error, _serviceClient) => {
      console.log('interceptor resp error 1')
      console.log(error)
      throw error
    },
  )
  list.addInterceptor(
    (response, _serviceClient) => {
      console.log('interceptor resp success 2')
      console.log(response)
      return response
    },
    (error, _serviceClient) => {
      console.log('interceptor resp error 2')
      console.log(error)
      throw error
    },
  )
  return list.getList()
}

export const mapEvents = (ownProps: mapPropsI): { func: () => void; setInfop: (i: string) => void } => ({
  func: () => {
    ownProps.func()
  },
  setInfop: (i: string) => {
    console.log('dddd2')
    console.log(i)
    ownProps.setInfop(i)
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
    axios
      .getAxiosNewClient('', () => {}, {}, undefined, createRequestInterceptors(), createResponseInterceptors(), true)
      .executeRequest(axiosReq)
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
  },
})

function wrapContexts<OuputProps = {}, OuputEvents = {}>(
  Component: FunctionComponent<OuputProps & OuputEvents>,
  mapProps: (ownProps: any) => OuputProps,
  mapEvents: (ownProps: any) => OuputEvents,
  ...contextDependencies: React.Context<any>[]
) {
  return (props: any) => {
    const contextList = contextDependencies.reduce((acc, i) => {
      const ctx = useContext(i)
      return { ...acc, ...ctx }
    }, {})
    return <Component {...mapProps({ ...contextList, ...props })} {...mapEvents({ ...contextList, ...props })} />
  }
}

type mapPropsI = ContextDataType & Context2DataType
export default wrapContexts(ExampComp, mapProps, mapEvents, Context, Context2)
