export interface GlobalDataPersistentSingletonType<Type> {
  keyName: string
  initialData: Type | undefined
  get: () => Type | undefined
  set: (data: Type, callback?: () => void) => void
  reset: (callback?: () => void) => void
  restore: (callback?: () => void) => void
}
