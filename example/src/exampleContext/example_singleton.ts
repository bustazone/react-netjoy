import { Singleton } from '../global_data_persistent_singleton'
import { SingletonXType } from './example_singleton.types'

const SingletonXKeyName = 'example'
export const SingletonX = new Singleton<SingletonXType>(SingletonXKeyName)
