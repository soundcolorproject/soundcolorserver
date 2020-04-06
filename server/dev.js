#!/usr/bin/env node

require('ts-node').register({
  project: require.resolve('../tsconfig.server.json'),
})

require('./index.ts')
