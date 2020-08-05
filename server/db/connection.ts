
import { config } from '../config'

export const initClient = config.remoteApi
  ? require('./mongo/connection').initClient
  : require('./memory/connection').initClient
