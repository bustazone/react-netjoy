import { getServiceClientMiddleware, loggerMiddleware } from './redux/NetworkMiddleware'
import request_budget_component from './request_budget_component/View'
import * as axios from './axios'
import * as debug from './debug'
import { extractPropertiesFromJsonObject } from './utils/ServiceBody.Utils'

const redux = {
  getServiceClientMiddleware,
  loggerMiddleware,
}

const utils = {
  extractPropertiesFromJsonObject,
}

export { redux, axios, debug, utils, request_budget_component }
