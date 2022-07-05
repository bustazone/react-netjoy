import React, { FunctionComponent, useState } from 'react'
import { Modal, StatusBar, View } from 'react-native'
import { ModalDialogContext } from '../context'
import styles from './View.Styles'
import { ModalDialogsHandlerViewProps } from './View.Types'

export const ModalDialogHandlerView: FunctionComponent<ModalDialogsHandlerViewProps> = props => {
  const [showed, setShowed] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState<Element | undefined>(undefined)
  const hideModalDialog = () => {
    setModalContent(undefined)
    setShowed(false)
  }
  const showModalDialog = (content: Element) => {
    console.log('showModalDialog')
    setModalContent(content)
    setShowed(true)
  }
  return (
    <ModalDialogContext.Provider value={{ showModalDialog, hideModalDialog }}>
      <View style={styles.container}>
        <StatusBar barStyle='dark-content' />
        {modalContent !== undefined && (
          <Modal animationType='slide' transparent visible={showed} onRequestClose={hideModalDialog}>
            {modalContent}
          </Modal>
        )}
        <View style={styles.childrenContainer}>{props.children}</View>
      </View>
    </ModalDialogContext.Provider>
  )
}
