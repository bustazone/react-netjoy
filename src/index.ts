import { getServiceClientMiddleware, loggerMiddleware } from './redux/NetworkMiddleware'
import request_budget_component from './request_budget_component/View'
import { createRequestInterceptor, createResponseInterceptor } from './base/Utils'
import { getAxiosNewClient, getAxiosNewClientMiddleware, getEmptyRequest, getEmptyAxiosRequestAction } from './axios'
import { extractPropertiesFromJsonObject } from './utils/ServiceBody.Utils'

const redux = {
  getServiceClientMiddleware,
  loggerMiddleware,
}

const axios = {
  getEmptyRequest,
  getEmptyAxiosRequestAction,
  getAxiosNewClient,
  getAxiosNewClientMiddleware,
}

const utils = {
  extractPropertiesFromJsonObject,
}

export { redux, axios, utils, request_budget_component, createRequestInterceptor, createResponseInterceptor }
