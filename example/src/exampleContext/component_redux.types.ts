export type ReduxOwnPropsType = {}
export type ReduxStatePropsType = { xxx: string | undefined }
export type ReduxEventPropsType = { xxxFunc: () => void }
export type ReduxPropsType = ReduxStatePropsType & ReduxEventPropsType
