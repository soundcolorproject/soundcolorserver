
import { BrowserWindow, app, screen } from 'electron'
import { config } from '../server/config'
import { logger } from '../shared/logger'
import { args } from './args'

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
    closable: !args.service && !config.dev,
  })

  if (args.service) {
    if (config.dev) {
      let closeCount = 0
      win.on('close', (ev) => {
        logger.info('close requested')
        if (++closeCount < 3) {
          logger.info('yup')
          ev.preventDefault()
          return false
        } else {
          logger.info('nope')
        }
      })
    } else {
      win.on('close', (ev) => {
        logger.info('Running in service mode -- preventing close')
        ev.preventDefault()
        return false
      })
    }
  }

  logger.info('Loading app into browser window...')
  await win.loadURL(`http://localhost:${config.port}/sovis`)

  win.show()

  if (args.fullscreen) {
    win.setFullScreen(true)
    await win.webContents.executeJavaScript('window.__FORCED_FULLSCREEN__ = true')
  }

  if (config.dev || args.debug) {
    win.webContents.openDevTools()
  }

  logger.info('Browser window loaded!')
}
