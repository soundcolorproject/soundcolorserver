/// <reference path="../server/globals.d.ts" />

import { app, BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions } from 'electron'

import { config } from '../server/config'
import { startup } from '../server/startup'
import { logger } from '../shared/logger'

import { args } from './args'
import { createLoadingWindow, destroyLoadingWindow } from './createLoadingWindow'
import { createWindow } from './createWindow'

const isMac = process.platform === 'darwin'
async function prepareApplication () {
  await startup()
  await createWindow()
}

export async function bootstrap () {
  config.remoteApi = false
  config.standaloneApp = true
  app.on('before-quit', () => {
    destroyLoadingWindow()
    logger.info('Exiting...')
  })
  await app.whenReady()
  const menu: (MenuItemConstructorOptions | MenuItem)[] = []
  if (!args.service) {
    const item = new MenuItem({
      label: 'File',
      submenu: [
        { role: 'close' },
      ],
    })
    if (!isMac) {
      item.submenu?.append(new MenuItem({ role: 'quit' }))
    }
    menu.push(item)
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))

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
