#!/usr/bin/env node

process.env.DEV = 'true'
process.env.NODE_ENV = 'development'
process.env.LOG_LEVEL = 'info'
process.env.USE_REMOTE_API = 'true'

require('hot-module-replacement')({
  ignore: /node_modules/,
})

require('ts-node').register({
  project: require.resolve('../tsconfig.server.json'),
})

require('./index.ts')
