import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios/index';
import { NetClientInterface } from './CommonTypes';
import {
  InterceptorType,
  RequestAuthInterceptorType,
  ResponseAuthInterceptorType,
} from './Interceptors';

export class NetClientAxios implements NetClientInterface {
  baseUrl: string;
  auth: boolean;
  requestInterceptor: InterceptorType[];
  responseInterceptor: InterceptorType[];
  authRequestInterceptor: RequestAuthInterceptorType;
  authResponseInterceptor: ResponseAuthInterceptorType;

  instance: AxiosInstance;

  constructor(
    baseUrl: string,
    auth: boolean,
    requestInterceptors: InterceptorType[],
    responseInterceptors: InterceptorType[],
    authRequestInterceptor: RequestAuthInterceptorType,
    authResponseInterceptor: ResponseAuthInterceptorType
  ) {
    this.baseUrl = baseUrl;
    this.auth = auth;
    this.requestInterceptor = requestInterceptors;
    this.responseInterceptor = responseInterceptors;
    this.authRequestInterceptor = authRequestInterceptor;
    this.authResponseInterceptor = authResponseInterceptor;
    this.instance = axios.create({
      baseURL: baseUrl,
      responseType: 'json',
      withCredentials: true,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json, text/javascript, */*, vnd.rim; q=0.01',
        'x-superadmin-front': 'react',
      },
      data: '',
    });

    if (auth) {
      this.instance.interceptors.request.use(config => {
        return Promise.resolve(authRequestInterceptor ? authRequestInterceptor(config) : config);
      });
      this.instance.interceptors.response.use(
        response => response,
        error => {
          return Promise.reject(authResponseInterceptor ? authResponseInterceptor(error) : error);
        }
      );
    }

    requestInterceptors.reverse().forEach((chain: InterceptorType) => {
      this.instance.interceptors.request.use(
        config => {
          let newConfig = config;
          if (chain.success) {
            try {
              newConfig = chain.success(config);
            } catch (error) {
              return Promise.reject(error);
            }
          }
          return Promise.resolve(newConfig);
        },
        error => {
          let newResponse;
          if (chain.error) {
            try {
              newResponse = chain.error(error);
            } catch (newCatchError) {
              return Promise.reject(newCatchError);
            }
            return Promise.resolve(newResponse);
          }
          return Promise.reject(error);
        }
      );
    });

    responseInterceptors.forEach((chain: InterceptorType) => {
      this.instance.interceptors.response.use(
        (response: AxiosResponse) => {
          let newResponse: AxiosResponse = response;
          if (chain.success) {
            try {
              newResponse = <AxiosResponse>chain.success(response);
            } catch (error) {
              return Promise.reject(error);
            }
          }
          return Promise.resolve(newResponse);
        },
        error => {
          let newResponse;
          if (chain.error) {
            try {
              newResponse = chain.error(error);
            } catch (newCatchError) {
              return Promise.reject(newCatchError);
            }
            return Promise.resolve(newResponse);
          }
          return Promise.reject(error);
        }
      );
    });
  }
  makeCall(
    url: string,
    method: string,
    body: string,
    headers: object,
    onSuccess: (response: object) => void,
    onFailure: (error: object) => void,
    onFinish: () => void
  ): void {
    const config: AxiosRequestConfig = {
      url,
      method: <Method>method,
      data: body,
      headers,
    };
    // Logger.log('start call')
    // Logger.log(config)
    this.instance(config)
      .then(response => {
        // console.log('success')
        // console.log(response)
        onSuccess(response.data);
      })
      .catch(error => {
        // console.log('error')
        // console.log(error)
        onFailure(error);
      })
      .then(() => {
        // console.log('finish')
        onFinish();
      });
  }
}
