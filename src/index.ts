import request_budget_component from './request_budget_component/View'
import * as axios from './axios'
import * as debug from './debug'
import * as redux from './redux'
import { extractPropertiesFromJsonObject } from './utils/ServiceBody.Utils'

const utils = {
  extractPropertiesFromJsonObject,
}

export { redux, axios, debug, utils, request_budget_component }
