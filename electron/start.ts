
import { bootstrap } from './bootstrap'
import { FatalError } from '../server/errors/FatalError'
import { logger } from '../shared/logger'

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
