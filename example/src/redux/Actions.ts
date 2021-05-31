import { CHANGE_TOKEN_ACTION } from './ActionConstants'
import { ChangeTokenAction } from './Actions.Types'

export function sessionSetCountry(token: string): ChangeTokenAction {
  return {
    type: CHANGE_TOKEN_ACTION,
    token,
  }
}
