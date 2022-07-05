export type ModalDialogContextType = {
  hideModalDialog: () => void
  showModalDialog: (content: Element) => void
}

export type withModalDialogContextPropType = {
  modalDialogsContext: ModalDialogContextType
}
