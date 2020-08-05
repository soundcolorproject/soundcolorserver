
import * as yargs from 'yargs'

import { config, init } from '../server/config'
import { logger } from '../shared/logger'

export const args = yargs
  .boolean(['d', 'f', 'l', 'r', 's', 'V'])
  .count(['v'])
  .alias('d', 'debug')
  .alias('f', 'fullscreen')
  .alias('l', 'local')
  .alias('r', 'remote')
  .alias('s', 'service')
  .alias('v', 'verbose')
  .alias('V', 'version')
  .argv

export function apply () {
  logger.info('args', args)
  if (args.local && args.remote) {
    logger.warn('Both remote and local mode requested -- falling back to local')
  }

  if (args.fullscreen) { config.forcedFullscreen = true }
  if (args.remote) { config.remoteApi = true }
  if (args.local) { config.remoteApi = false }
  if (args.service) { config.serviceMode = true }
  if (args.verbose) {
    switch (args.verbose) {
      case 1: logger.logLevel = 'log'; break
      case 2: logger.logLevel = 'info'; break
      default: logger.logLevel = 'debug'; break
    }
  }

  init()
}
