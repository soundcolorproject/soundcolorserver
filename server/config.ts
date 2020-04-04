
// tslint:disable: no-console
import { getLogLevel } from '../shared/getLogLevel'

try {
  const result = require('dotenv').config()
  if (result.parsed) {
    console.info('Loaded .env file')
  } else if (result.error) {
    if (/ENOENT/.test(result.error.toString())) {
      console.info('No .env file present')
    } else {
      console.warn('Failed to load .env file:')
      console.warn(result.error.toString())
    }
  }
} catch (e) {
  // do nothing
}

export const config = {
  logLevel: getLogLevel(),
  dev: process.env.DEV === 'true',
  remoteApi: process.env.USE_REMOTE_API === 'true',
  clientId: process.env.HUE_CLIENT_ID || '',
  clientSecret: process.env.HUE_CLIENT_SECRET || '',
  toJSON: () => { throw new Error('Failed to stringify config file.') },
}
