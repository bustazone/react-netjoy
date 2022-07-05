import React, { FunctionComponent, useEffect } from 'react'
import { SingletonHandlerPropTypes } from './view.types'

const SingletonHandlerView: FunctionComponent<SingletonHandlerPropTypes> = (props: SingletonHandlerPropTypes) => {
  useEffect(() => {
    async function restore() {
      props.singletons.forEach(singleton => {
        singleton.getInstance().restore()
      })
    }
    restore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <>{props.children}</>
}

export default SingletonHandlerView
