import { CHANGE_TOKEN_ACTION } from './ActionConstants'
import { ChangeTokenAction } from './Actions.Types'

export type AuthState = {
  token: string | undefined
}

const initialState: AuthState = {
  token: 'initial',
}

const authReducer = (state: AuthState = initialState, action: any) => {
  switch (action.type) {
    case CHANGE_TOKEN_ACTION:
      return { ...state, token: (action as ChangeTokenAction).token }
    default:
      return state
  }
}

export default authReducer
