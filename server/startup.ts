/// <reference path="./globals.d.ts" />

import { Application } from 'express'
import { createServer, Server } from 'http'
import { createServer as createHttpsServer } from 'https'
import { join } from 'path'
import { readFileSync } from 'fs'
import { buildApp } from './app'
import { logger } from '../shared/logger'
import { config, init } from './config'
import { FatalError, FatalErrorCode } from './errors/FatalError'
import { initDb } from './initDb'

/**
 * generates a random port number between 5000 - 49999
 */
function randomPort () {
  return 5000 + Math.floor(Math.random() * 35000)
}

function startServerOnPort (app: Application, port: number, create: () => Server) {
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

async function startServer (app: Application) {
  let failCount = 0
  const MAX_FAILS = config.dev || config.standaloneApp ? 10 : 1
  const origPort = config.port
  const serverCreator = config.localSsl ?
    () => createHttpsServer({
      cert: readFileSync(join(__dirname, '../local/server.cert')),
      key: readFileSync(join(__dirname, '../local/server.key')),
    }) :
    () => createServer()
  while (failCount < MAX_FAILS) {
    try {
      config.port = failCount === 0 ? origPort : randomPort()
      // this has to be awaited in order to be able to catch the error
      const server = await startServerOnPort(app, config.port, serverCreator)
      return server
    } catch (e) {
      if (!config.dev) {
        throw new FatalError(
          FatalErrorCode.EXPECTED_PORT_FAILED_TO_OPEN,
          `Port ${config.port} cannot be opened!`,
        )
      }
      failCount++
    }
  }
  throw new FatalError(
    FatalErrorCode.NO_AVAILABLE_PORTS,
    'Could not find an open port!',
  )
}

export async function startup () {
  init()
  let app = buildApp()
  await initDb()
  const server = await startServer(app)
  server.on('request', app)
  // tslint:disable-next-line: no-console
  console.log('Server ready')

  if (module.hot) {
    let currentApp = app
    module.hot.accept('./app', () => {
      try {
        logger.info('New module for server/app')
        const { buildApp } = require('./app')
        server.removeListener('request', currentApp)
        currentApp = buildApp()
        server.on('request', currentApp)
        logger.info('Express app reloaded!')
      } catch (err) {
        logger.error('Failed to reload express app:', err)
      }
    })
  }
}
