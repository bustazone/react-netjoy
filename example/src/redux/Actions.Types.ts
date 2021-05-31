import {
  CHANGE_TOKEN_ACTION,
} from './ActionConstants'

export interface ChangeTokenAction {
  type: typeof CHANGE_TOKEN_ACTION
  token: string
}
