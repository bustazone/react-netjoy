import { getServiceClientMiddleware, loggerMiddleware } from './redux/NetworkMiddleware'
import request_budget_component from './request_budget_component/View'
import {
  getAxiosNewClient,
  getAxiosNewClientMiddleware,
  getAxiosEmptyRequestAction,
  getAxiosEmptyRequest,
  AxiosResponseInterceptorList,
  AxiosRequestInterceptorList,
} from './axios'
import {
  DebugRequestInterceptorList,
  DebugResponseInterceptorList,
  getDebugEmptyRequest,
  getDebugEmptyRequestAction,
  getDebugNewClient,
  getDebugNewClientMiddleware,
} from './debug'
import { extractPropertiesFromJsonObject } from './utils/ServiceBody.Utils'

const redux = {
  getServiceClientMiddleware,
  loggerMiddleware,
}

const axios = {
  AxiosRequestInterceptorList,
  AxiosResponseInterceptorList,
  getAxiosEmptyRequest,
  getAxiosEmptyRequestAction,
  getAxiosNewClient,
  getAxiosNewClientMiddleware,
}

const debug = {
  DebugRequestInterceptorList,
  DebugResponseInterceptorList,
  getDebugEmptyRequest,
  getDebugEmptyRequestAction,
  getDebugNewClient,
  getDebugNewClientMiddleware,
}

const utils = {
  extractPropertiesFromJsonObject,
}

export { redux, axios, debug, utils, request_budget_component }
