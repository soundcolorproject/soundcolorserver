
import { BrowserWindow, app, screen } from 'electron'
import { config } from '../server/config'
import { logger } from '../shared/logger'

export async function createWindow () {
  logger.info('Creating new browser window...')
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const win = new BrowserWindow({
    width,
    height,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  logger.info('Loading app into browser window...')
  await win.loadURL(`http://localhost:${config.port}/sovis`)
  win.show()

  if (config.dev) {
    win.webContents.openDevTools()
  }

  logger.info('Browser window loaded!')
}
