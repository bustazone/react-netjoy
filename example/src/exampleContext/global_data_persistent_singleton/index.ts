import AsyncStorage from '@react-native-async-storage/async-storage'

const GlobalDataPersistentSingleton = <Type>(keyName: string) => {
  const value: { value: Type | undefined } = { value: undefined }
  const get = (): Type | undefined => {
    return value.value
  }
  const set = (todo: Type) => {
    AsyncStorage.setItem(keyName, JSON.stringify(value))
    value.value = todo
  }
  const restore = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(keyName)
      if (jsonValue != null) {
        value.value = JSON.parse(jsonValue)
      }
    } catch (e) {
      throw new Error(`Error: Restoring GlobalDataPersistentSingleton for ${keyName} key.`)
    }
  }
  const reset = () => {
    value.value = undefined
    try {
      AsyncStorage.removeItem(keyName)
    } catch (e) {
      throw new Error(`Error: Resetting GlobalDataPersistentSingleton for ${keyName} key.`)
    }
  }
  return {
    get,
    set,
    restore,
    reset,
  }
}

export async function createGlobalDataPersistentSingleton<Type>(keyName: string) {
  const out = GlobalDataPersistentSingleton<Type>(keyName)
  await out.restore()
  return out
}
