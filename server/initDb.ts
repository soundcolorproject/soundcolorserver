
import { join } from 'path'
import { readdirSync } from 'fs'
import { initClient } from './db/connection'

interface InittableCollection {
  initCollection?: () => Promise<void>
}
async function initFile (filename: string) {
  let file: InittableCollection
  try {
    file = require(filename)
  } catch (e) {
    return
  }

  if (file.initCollection) {
    await file.initCollection()
  }
}

const dbDir = join(__dirname, 'db')
export async function initDb () {
  await initClient()
  const filepaths = readdirSync(dbDir)
    .map(file => join(dbDir, file))

  await Promise.all(filepaths.map(initFile))
}
