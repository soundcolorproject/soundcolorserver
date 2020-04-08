
import { connect, MongoClient, Db } from 'mongodb'
import { config } from '../config'
import { FatalError, FatalErrorCode } from '../errors/FatalError'

let mongoClient: MongoClient
let db: Db
export async function initClient () {
  try {
    // tslint:disable-next-line: no-console
    console.info('Connecting to database...')
    mongoClient = await connect(config.mongodbUri, { useUnifiedTopology: true })
    db = mongoClient.db()
  } catch (e) {
    throw new FatalError(
      FatalErrorCode.MONGODB_CONNECTION_FAILED,
      'Failed to connect to database',
      e,
    )
  }
}

export function getClient () {
  return mongoClient
}

export function getDb () {
  return db
}
