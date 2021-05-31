import React, { Dispatch, FunctionComponent, Reducer, useContext, useReducer } from 'react';
import { InferableComponentEnhancerWithProps } from 'react-redux';

export type wrapContextsV2ContextComponentType = (Component: FunctionComponent) => FunctionComponent

export function wrapContextsV2ContextComponent(componentId: string, context: React.Context<any>): wrapContextsV2ContextComponentType {
  return (Component: FunctionComponent) => {
    return (ownProps: any) => {
      const ctx = useContext(context)
      const innerProps = {
        [componentId]: ctx,
      }
      return <Component {...ownProps} {...innerProps} />
    }
  }
}

export function wrapReducerV2ContextComponent<ReducerStateType, ReducerActionsType>(
  componentId: string,
  reducer: Reducer<any, any>,
  initState: ReducerStateType,
  dispatchToProps: (dispatch: Dispatch<any>) => ReducerActionsType,
): wrapContextsV2ContextComponentType {
  return (Component: FunctionComponent) => {
    return (ownProps: any) => {
      const [state, dispatch] = useReducer<typeof reducer>(reducer, initState)
      const innerProps = {
        [componentId]: { ...state, ...dispatchToProps(dispatch) },
      }
      return <Component {...ownProps} {...innerProps} />
    }
  }
}

export function wrapReduxV2ContextComponent(
  componentId: string,
  reduxConnect: InferableComponentEnhancerWithProps<any, any>,
): wrapContextsV2ContextComponentType {
  return (Component: FunctionComponent) => {
    return (ownProps: any) => {
      const Comp: FunctionComponent = (props: any) => {
        const innerProps = {
          [componentId]: props,
        }
        return <Component {...ownProps} {...innerProps} />
      }
      const ConnectComp = reduxConnect(Comp)
      return <ConnectComp />
    }
  }
}

export function wrapFakeV2ContextComponent(componentId: string, fakePropName: string): wrapContextsV2ContextComponentType {
  return (Component: FunctionComponent) => {
    return (ownProps: any) => {
      const ctx = {
        [fakePropName]: fakePropName + '<-------',
      }
      const innerProps = {
        [componentId]: ctx,
      }
      return <Component {...ownProps} {...innerProps} />
    }
  }
}

export function wrapContextsV2<InputProps = any, OwnProps = any, OuputProps = any, OuputEvents = any>(
  Component: FunctionComponent<OuputProps & OuputEvents>,
  mapProps: (ownProps: InputProps & OwnProps) => OuputProps,
  mapEvents: (ownProps: InputProps & OwnProps) => OuputEvents,
  components: wrapContextsV2ContextComponentType[],
): FunctionComponent<OwnProps> {
  const Comp: FunctionComponent = (props: any) => {
    return <Component {...mapProps({ ...props })} {...mapEvents({ ...props })} />
  }
  return (ownProps: OwnProps) => {
    const ResultComponent = components.reverse().reduce((acc, WrapComponent) => {
      return WrapComponent(acc)
    }, Comp)
    return <ResultComponent {...ownProps} />
  }
}
