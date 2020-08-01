/// <reference path="./globals.d.ts" />

import { logger } from '../shared/logger'

import { FatalError } from './errors/FatalError'
import { startup } from './startup'

startup().catch(e => {
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
