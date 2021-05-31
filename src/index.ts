import request_budget_component from './request_budget_component/View'
import * as axios from './axios'
import * as debug from './debug'
import * as redux from './redux'
import { extractPropertiesFromJsonObject } from './utils/ServiceBody.Utils'
import { Request } from './base/Request'

const utils = {
  extractPropertiesFromJsonObject,
}

function getEmptyRequest<State, DomainResponseType, DomainErrorType>() {
  return new Request<State, DomainResponseType, DomainErrorType>()
}

export { redux, axios, debug, utils, request_budget_component, getEmptyRequest }
