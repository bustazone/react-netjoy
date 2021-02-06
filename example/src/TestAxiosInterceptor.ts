import {ServiceClientInterface} from "../../src/base/CommonTypes";

export const manageError = (
  _getState: () => {},
  _next: () => {},
) => (
  _serviceClient: ServiceClientInterface<
    RootState,
    NetClientAxios,
    AxiosNetClientConfig,
    AxiosResponse,
    AxiosError
  >,
) => (error: AxiosError) => {
  console.log('error')
  console.log(error)
  throw error
}
