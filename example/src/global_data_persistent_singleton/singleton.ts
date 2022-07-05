import AsyncStorage from '@react-native-async-storage/async-storage'
import { GlobalDataPersistentSingletonType } from './singleton.types'

export class Singleton<SingletonType> {
  private _instance: GlobalDataPersistentSingletonType<SingletonType> | undefined
  keyName: string
  constructor(keyName: string) {
    this.keyName = keyName
  }
  getInstance() {
    if (!this._instance) {
      this._instance = createGlobalDataPersistent<SingletonType>(this.keyName)
    }
    return this._instance
  }

  // static get instance(rr: string) {
  //   if (instance === null) {
  //     instance = new AccountsNetworkService();
  //   }
  //
  //   return instance;
  // }
}

const createGlobalDataPersistent = <Type>(keyName: string, initialData?: Type): GlobalDataPersistentSingletonType<Type> => {
  const value: { value: Type | undefined } = { value: undefined }
  const get = (): Type | undefined => {
    return value.value
  }
  const set = (todo: Type, callback?: () => void) => {
    value.value = todo
    new Promise(async () => {
      await AsyncStorage.setItem(keyName, JSON.stringify(value))
    }).then(() => {
      if (callback) callback()
    })
  }
  const restore = (callback?: () => void) => {
    new Promise(async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(keyName)
        if (jsonValue != null) {
          value.value = JSON.parse(jsonValue)
        }
        if (callback) callback()
      } catch (e) {
        throw new Error(`Error: Restoring GlobalDataPersistentSingleton for ${keyName} key.`)
      }
    }).then(() => {
      if (callback) callback()
    })
  }
  const reset = (callback?: () => void) => {
    value.value = initialData
    new Promise(async () => {
      try {
        if (initialData) {
          await AsyncStorage.setItem(keyName, JSON.stringify(initialData))
        } else {
          await AsyncStorage.removeItem(keyName)
        }
      } catch (e) {
        throw new Error(`Error: Resetting GlobalDataPersistentSingleton for ${keyName} key.`)
      }
    }).finally(() => {
      if (callback) callback()
    })
  }
  value.value = initialData
  return {
    keyName,
    initialData,
    get,
    set,
    reset,
    restore,
  }
}
