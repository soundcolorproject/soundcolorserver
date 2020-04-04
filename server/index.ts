/// <reference path="./globals.d.ts" />

import { app } from './app'
import { logger } from '../shared/logger'

function randomPort () {
  return 5000 + Math.floor(Math.random() * 35000)
}

function getPort () {
  if (process.env.PORT) {
    return parseInt(process.env.PORT, 10)
  } else {
    return randomPort()
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
      logger.log(`Server listening on port ${port}`)
      resolve(app)
    })
  })
}

async function main () {
  let failCount = 0
  while (failCount < 10) {
    try {
      await startApp(failCount === 0 ? getPort() : randomPort())
      return
    } catch (e) {
      failCount++
    }
  }
  throw new Error('Failed to start the server!')
}

main().catch(e => {
  logger.error(e)
})
