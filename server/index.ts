/// <reference path="./globals.d.ts" />

import { createServer, Server } from 'http'
import { createServer as createHttpsServer } from 'https'
import { join } from 'path'
import { readFileSync } from 'fs'
import { app } from './app'
import { logger } from '../shared/logger'
import { config } from './config'
import { FatalError } from './errors/FatalError'

function randomPort () {
  return 5000 + Math.floor(Math.random() * 35000)
}

function getPort () {
  if (process.env.PORT) {
    return parseInt(process.env.PORT, 10)
  } else if (config.localSsl) {
    return 443
  } else {
    return 9000
  }
}

function startServerOnPort (port: number, create: () => Server) {
  return new Promise<Server>((resolve, reject) => {
    app.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        reject(err)
      }
    })
    const server = create()
    server.listen(port, () => {
      // tslint:disable-next-line: no-console
      console.log(`Server listening on port ${port}`)
      resolve(server)
    })
  })
}

const MAX_FAILS = config.dev ? 10 : 1
async function startServer () {
  let failCount = 0
  const serverCreator = config.localSsl ?
    () => createHttpsServer({
      cert: readFileSync(join(__dirname, '../local/server.cert')),
      key: readFileSync(join(__dirname, '../local/server.key')),
    }) :
    () => createServer()
  while (failCount < MAX_FAILS) {
    try {
      // this has to be awaited in order to be able to catch the error
      const server = await startServerOnPort(failCount === 0 ? getPort() : randomPort(), serverCreator)
      return server
    } catch (e) {
      if (!config.dev) {
        new FatalError(2, `Port ${getPort()} cannot be opened!`)
      }
      failCount++
    }
  }
  throw new FatalError(3, 'Could not find an open port!')
}

async function main () {
  const server = await startServer()
  server.on('request', app)

  if (module.hot) {
    let currentApp = app
    module.hot.accept('./app', () => {
      try {
        logger.info('New module for server/app')
        const { app: newApp } = require('./app')
        server.removeListener('request', currentApp)
        currentApp = newApp
        server.on('request', newApp)
        logger.info('Express app reloaded!')
      } catch (err) {
        logger.error('Failed to reload express app:', err)
      }
    })
  }
}

main().catch(e => {
  logger.fatal(e)
  if (e instanceof FatalError) {
    process.exit(e.exitCode)
  } else {
    process.exit(1)
  }
})
