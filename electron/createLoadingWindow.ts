
import { join } from 'path'
import { app, BrowserWindow } from 'electron'
import { sleep } from './helpers'
import { args } from './args'

let loadingWindow: BrowserWindow | null = null

export async function createLoadingWindow (waitFor: Promise<void>) {
  if (loadingWindow) {
    return
  }
  await app.whenReady()

  loadingWindow = new BrowserWindow({
    width: 600,
    height: 300,
    titleBarStyle: 'hidden',
    frame: false,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    center: true,
    closable: false,
  })

  if (args.fullscreen) {
    loadingWindow.setFullScreen(true)
  }

  await loadingWindow.loadFile(join(__dirname, './static/loading.html'))
  await Promise.all([waitFor, sleep(1000)])

  destroyLoadingWindow()
}

export function destroyLoadingWindow () {
  if (loadingWindow) {
    loadingWindow.hide()
    loadingWindow.destroy()
    loadingWindow = null
  }
}
