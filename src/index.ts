import { getServiceClientMiddleware, loggerMiddleware } from './redux/NetworkMiddleware'
import request_budget_component from './request_budget_component/View'
import { createRequestInterceptor, createResponseInterceptor } from './base/Utils'
import { getAxiosNewClient, getAxiosNewClientMiddleware, getAxiosEmptyRequestAction, getAxiosEmptyRequest } from './axios'
import { getDebugNewClient, getDebugNewClientMiddleware, getDebugEmptyRequestAction, getDebugEmptyRequest } from './debug'
import { extractPropertiesFromJsonObject } from './utils/ServiceBody.Utils'

const redux = {
  getServiceClientMiddleware,
  loggerMiddleware,
}

const axios = {
  getAxiosEmptyRequest,
  getAxiosEmptyRequestAction,
  getAxiosNewClient,
  getAxiosNewClientMiddleware,
}

const debug = {
  getDebugEmptyRequest,
  getDebugEmptyRequestAction,
  getDebugNewClient,
  getDebugNewClientMiddleware,
}

const utils = {
  extractPropertiesFromJsonObject,
  createRequestInterceptor,
  createResponseInterceptor,
}

export { redux, axios, debug, utils, request_budget_component }
