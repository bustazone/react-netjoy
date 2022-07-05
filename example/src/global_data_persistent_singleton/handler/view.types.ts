import { PropsWithChildren } from 'react'
import { Singleton } from '../singleton'

export type SingletonHandlerPropTypes = PropsWithChildren<{ singletons: Singleton<any>[] }>
