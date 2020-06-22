/// <reference path="../server/globals.d.ts" />

import { app, BrowserWindow } from 'electron'
import { startup } from '../server/startup'
import { logger } from '../shared/logger'
import { FatalError } from '../server/errors/FatalError'
import { createWindow } from './createWindow'
import { config } from '../server/config'
import { createLoadingWindow, destroyLoadingWindow } from './createLoadingWindow'

async function prepareApplication () {
  await startup()
  await createWindow()
}

async function bootstrap () {
  config.remoteApi = false
  config.standaloneApp = true
  app.on('before-quit', () => {
    destroyLoadingWindow()
    logger.info('Exiting...')
  })
  await app.whenReady()

  logger.info('Launching server & electron app...')
  await createLoadingWindow(prepareApplication())

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow().catch(e => {
        logger.error('Failed to open new window:', e)
      })
    }
  })

  logger.info('Electron app ready!')
}

bootstrap().catch(e => {
  logger.fatal(e)
  if (e instanceof FatalError) {
    if (e.cause) {
      logger.fatal('caused by:', e.cause)
    }

    process.exit(e.exitCode)
  } else {
    process.exit(1)
  }
})
