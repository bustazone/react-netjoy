import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux'
import { Dispatch } from 'redux'
import { AuthState } from '../redux/reducer'
import { sessionSetCountry } from '../redux/Actions'
import { ReduxEventPropsType, ReduxOwnPropsType, ReduxStatePropsType } from './component_redux.types'

const mapStateToProps: MapStateToProps<ReduxStatePropsType, ReduxOwnPropsType, AuthState> = (state: AuthState, _ownProps: {}) => ({
  xxx: state.token,
})

const mapDispatchToProps: MapDispatchToProps<ReduxEventPropsType, ReduxOwnPropsType> = (dispatch: Dispatch, _ownProps: {}) => ({
  xxxFunc: () => {
    dispatch(sessionSetCountry('erererer'))
  },
})

const ConnectRedux = connect<ReduxStatePropsType, ReduxEventPropsType, ReduxOwnPropsType, AuthState>(mapStateToProps, mapDispatchToProps)

export default ConnectRedux
