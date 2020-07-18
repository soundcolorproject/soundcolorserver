
import * as fs from 'fs'
import * as path from 'path'
import * as url from 'url'
import * as express from 'express'
import { logger } from '../../shared/logger'
import { config } from '../config'

let proxy: express.RequestHandler
function getProxy (port: number) {
  if (!proxy) {
    proxy = require('express-http-proxy')(`http://localhost:${port}`)
  }

  return proxy
}

const removePrefixForRoot = [
  /^\/storybook(\/(index.html)?)?$/,
  /^\/storybook\/sb_dll/,
  /^\/storybook\/runtime~main./,
  /^\/storybook\/vendors~main./,
  /^\/storybook\/main./,
]
const removePrefixForIframe = [
  /\.hot-update\.json$/,
  /__webpack_hmr$/,
]

function shouldRemovePrefix (req: express.Request) {
  if (req.header('referer')?.includes('iframe.html')) {
    return removePrefixForIframe.some(rgx => rgx.test(req.path))
  }

  return removePrefixForRoot.some(rgx => rgx.test(req.path))
}

const STORYBOOK_PATH = '/storybook'
export function storybookMiddleware (): express.RequestHandler {
  try {
    if (fs.existsSync(path.join(__dirname, '../../public/storybook'))) {
      return (_req, _res, next) => next()
    }

    process.env.BUILD = 'true'
    const storybookPort = config.port + 1
    process.argv = ['node', 'start-storybook', '-p', `${storybookPort}`, '-s', path.join(__dirname, '../../static'), '--ci']
    require('@storybook/react/dist/server')

    return (req, res, next) => {
      logger.info('req.path', req.path)
      if (!req.path.startsWith(STORYBOOK_PATH)) {
        return next()
      }

      try {
        if (shouldRemovePrefix(req)) {
          let origUrl = url.parse(req.url)
          req.url = url.format({
            ...origUrl,
            pathname: req.path.substring(STORYBOOK_PATH.length),
          })
          logger.info('new url:', req.url)
          logger.info('new url:', req.path)
        }

        getProxy(storybookPort)(req, res, next)
      } catch (err) {
        logger.error(err)
        next(err)
      }
    }
  } catch (err) {
    return (_req, _res, next) => next()
  }
}
