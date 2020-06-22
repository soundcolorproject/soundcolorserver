
import * as path from 'path'
import * as express from 'express'
import * as wp from 'webpack'
import * as wdm from 'webpack-dev-middleware'
import * as whm from 'webpack-hot-middleware'
import { config } from '../config'

let compiler: wp.Compiler | null = null
let compilerError: Error | null = null
function getCompiler () {
  if (compilerError) {
    throw compilerError
  } else if (!compiler) {
    try {
      const webpack = require('webpack') as typeof wp
      compiler = webpack(require('../../config/webpack').default({ appMode: config.standaloneApp }))
      // tslint:disable-next-line: no-console
      console.info('Using webpack middleware')
    } catch (e) {
      compilerError = e
      // tslint:disable-next-line: no-console
      console.info('Using precompiled assets')

      throw e
    }
  }

  return compiler
}

let webpackMiddlewareInstance: express.RequestHandler | null = null
export function webpackMiddleware (): express.RequestHandler {
  if (!webpackMiddlewareInstance) {
    try {
      const webpackDevMiddleware = require('webpack-dev-middleware') as typeof wdm

      webpackMiddlewareInstance = webpackDevMiddleware(getCompiler())
    } catch (e) {

      // fall back to build assets
      webpackMiddlewareInstance = express.static(path.join(__dirname, '../../public'), {
        etag: true,
        lastModified: true,
      })
    }
  }

  return webpackMiddlewareInstance
}

export function webpackHotMiddleware (): express.RequestHandler {
  try {
    const webpackHotMiddleware = require('webpack-hot-middleware') as typeof whm

    return webpackHotMiddleware(getCompiler(), {
      heartbeat: 2000,
    })
  } catch (e) {

    return (req, res, next) => next()
  }
}

export function html5Fallback (): express.RequestHandler {
  const webpack = webpackMiddleware()

  return (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next()
    }

    const newReq = {
      ...req,
      url: '/',
      originalUrl: '/',
    } as express.Request

    webpack(newReq, res, next)
  }
}
