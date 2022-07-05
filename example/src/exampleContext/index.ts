import { Context } from './component_context_1'
import { Context2 } from './component_context_2'
import ExampComp from './View'
import MapRedux from './component_redux'
import { executeCall } from './NetworkCall'
import { combineStates, context, fake, reducer, redux, singleton, state } from '../join_contexts_HOC'
import { ExampCompPropsType } from './View.Types';
import { ContextDataType } from './component_context_1.types'
import { Context2DataType } from './component_context_2.types'
import { ReduxPropsType } from './component_redux.types'
import { component_reducer, dispatchToProps, initState } from './component_reducer'
import { LocalReducerProps } from './component_reducer.types'
import { ModalDialogContext, ModalDialogContextType } from '../modal_dialogs'
import ModalExampView from './ModalViewExample'
import * as React from 'react'
import { initialData } from './component_state'
import { StateType } from './component_state.types'
import { SingletonX } from './example_singleton'
import { SingletonXType } from './example_singleton.types'

export const mapProps = (ownProps: joinedTypeProps & ownProps): ExampCompPropsType => ({
  // data: ownProps.ctx1.data,
  data: ownProps.red1.xxx,
  info: ownProps.ctx2.info2,
  func: () => {
    // ownProps.ctx1.func()
    ownProps.red1.xxxFunc()
    // ownProps.modalDialogs.showModalDialog(React.createElement(ModalExampView, { hide: ownProps.modalDialogs.hideModalDialog }))
    ownProps.modalDialogs.showModalDialog(React.createElement(ModalExampView, { hide: ownProps.modalDialogs.hideModalDialog }))
  },
  setInfop: (i: string) => {
    ownProps.ctx1.setInfop(i)
    executeCall()
  },
})

type joinedTypeProps = {
  ctx1: ContextDataType
  ctx2: Context2DataType
  modalDialogs: ModalDialogContextType
  red1: ReduxPropsType
  fake1: fake.DataType
  reducer1: LocalReducerProps
  singleton: singleton.DateType<SingletonXType>
  state: state.DataType<StateType>
}

type ownProps = {
  initialInput: string
}

export default combineStates<joinedTypeProps, ownProps, ExampCompPropsType>(ExampComp, mapProps, [
  context.createComponent('ctx1', Context),
  context.createComponent('ctx2', Context2),
  context.createComponent('modalDialogs', ModalDialogContext),
  redux.createComponent('red1', MapRedux),
  fake.createComponent('fake1', 'aa'),
  reducer.createComponent('reducer1', component_reducer, initState, dispatchToProps),
  singleton.createComponent('singleton', SingletonX),
  state.createComponent('state', initialData),
])
