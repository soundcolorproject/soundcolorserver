
// tslint:disable: no-console
import { readFileSync } from 'fs'
import { join } from 'path'
import { getLogLevel } from '../shared/getLogLevel'
import { CannotStringifyError } from './errors/CannotStringifyError'

try {
  const dotenv = require('dotenv')
  const envFile = join(__dirname, '../.env')
  try {
    const envConfig = dotenv.parse(readFileSync(envFile))
    for (const k in envConfig) {
      process.env[k] = envConfig[k]
    }

    console.info('Loaded .env file')
  } catch (e) {
    if (/ENOENT/.test(e.toString())) {
      console.info('No .env file present')
    } else {
      console.warn('Failed to load .env file:', e)
    }
  }
} catch (e) {
  // do nothing
}

export const config = {
  logLevel: getLogLevel(),
  dev: process.env.DEV === 'true',
  localSsl: process.env.LOCAL_SSL === 'true',
  remoteApi: process.env.USE_REMOTE_API === 'true',
  disableBlink: process.env.DISABLE_BLINK === 'true',
  clientId: process.env.HUE_CLIENT_ID || '',
  clientSecret: process.env.HUE_CLIENT_SECRET || '',
  appId: process.env.HUE_APP_ID || '',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/soundcolor',
  toJSON: () => { throw new CannotStringifyError('config file') },
}

if (config.remoteApi) {
  console.info('Using remote api')
} else {
  console.info('Using local api')
}
