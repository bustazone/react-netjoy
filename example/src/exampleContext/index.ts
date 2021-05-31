import { Context } from './component_context_1'
import { Context2 } from './component_context_2'
import ExampComp from './View'
import MapRedux from './component_redux'
import { executeCall } from './NetworkCall'
import {
  wrapContextsV2,
  wrapContextsV2ContextComponent,
  wrapFakeV2ContextComponent,
  wrapReducerV2ContextComponent,
  wrapReduxV2ContextComponent,
} from './join_contexts_HOC'
import { ExampCompEventPropsType, ExampCompInputPropsType } from './View.Types'
import { ContextDataType } from './component_context_1.types'
import { Context2DataType } from './component_context_2.types'
import { ReduxPropsType } from './component_redux.types'
import { component_reducer, dispatchToProps, initState } from './component_reducer'
import { LocalReducerProps } from './component_reducer.types'

export const mapProps = (ownProps: joinedTypeProps & ownProps): ExampCompInputPropsType => ({
  // data: ownProps.ctx1.data,
  data: ownProps.red1.xxx,
  info: ownProps.ctx2.info2,
})

export const mapEvents = (ownProps: joinedTypeProps & ownProps): ExampCompEventPropsType => ({
  func: () => {
    // ownProps.ctx1.func()
    ownProps.red1.xxxFunc()
  },
  setInfop: (i: string) => {
    ownProps.ctx1.setInfop(i)
    executeCall()
  },
})

type joinedTypeProps = {
  ctx1: ContextDataType
  ctx2: Context2DataType
  red1: ReduxPropsType
  fake1: { [key: string]: string }
  reducer1: LocalReducerProps
}

type ownProps = {
  initialInput: string
}

// export default wrapContexts(ExampComp, mapProps, mapEvents, Context, Context2)
export default wrapContextsV2<joinedTypeProps, ownProps, ExampCompInputPropsType, ExampCompEventPropsType>(ExampComp, mapProps, mapEvents, [
  wrapContextsV2ContextComponent('ctx1', Context),
  wrapContextsV2ContextComponent('ctx2', Context2),
  wrapReduxV2ContextComponent('red1', MapRedux),
  wrapFakeV2ContextComponent('fake1', 'aa'),
  wrapReducerV2ContextComponent('reducer1', component_reducer, initState, dispatchToProps),
])
