/// <reference path="./globals.d.ts" />

import { createServer } from 'https'
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
  } else {
    return 9000
  }
}

function startApp (port: number) {
  return new Promise((resolve, reject) => {
    app.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        reject(err)
      }
    })
    app.listen(port, () => {
      // tslint:disable-next-line: no-console
      console.log(`Server listening on port ${port}`)
      resolve(app)
    })
  })
}

async function main () {
  let failCount = 0
  if (config.localSsl) {
    const server = createServer({
      cert: readFileSync(join(__dirname, '../local/server.cert')),
      key: readFileSync(join(__dirname, '../local/server.key')),
    }, app).listen(443, '127.0.0.1', () => {
      // tslint:disable-next-line: no-console
      console.log('Server listening over https')
    })
    return
  }
  while (failCount < 10) {
    try {
      await startApp(failCount === 0 ? getPort() : randomPort())
      return
    } catch (e) {
      failCount++
    }
  }
  throw new FatalError(2, 'Could not find an open port!')
}

main().catch(e => {
  logger.fatal(e)
  if (e instanceof FatalError) {
    process.exit(e.exitCode)
  } else {
    process.exit(1)
  }
})
