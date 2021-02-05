import React, { FunctionComponent, useContext } from 'react'
import { Context, ContextDataType } from './Handler'
import { Context2, Context2DataType } from './Handler2'
import ExampComp from './Compoenent'

export const mapProps = (ownProps: mapPropsI): { data: string; info: string } => ({
  data: ownProps.data,
  info: ownProps.info2,
})
export const mapEvents = (ownProps: mapPropsI): { func: () => void; setInfop: (i: string) => void } => ({
  func: () => {
    ownProps.func()
  },
  setInfop: (i: string) => {
    console.log('dddd')
    console.log(i)
    ownProps.setInfop(i)
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
