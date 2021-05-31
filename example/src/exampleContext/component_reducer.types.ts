export type LocalReducerState = {
  counter: boolean
}

export type LocalReducerInputProps = LocalReducerState

export type LocalReducerEventProps = {
  setCounter: (loading: boolean) => void
}

export type LocalReducerProps = LocalReducerInputProps & LocalReducerEventProps
