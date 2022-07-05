import React, { createContext, FunctionComponent, useContext } from 'react'
import { ModalDialogContextType, withModalDialogContextPropType } from './index.types';

export const ModalDialogContext = createContext<ModalDialogContextType>({
  showModalDialog: () => {},
  hideModalDialog: () => {},
})

export function withModalDialogContext<OwnProps>(Component: FunctionComponent<OwnProps>) {
  return (ownProps: OwnProps) => {
    const ctx = useContext<ModalDialogContextType>(ModalDialogContext)
    const innerProps: withModalDialogContextPropType = {
      modalDialogsContext: ctx,
    }
    return <Component {...ownProps} {...innerProps} />
  }
}
