
import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

const statAsync = promisify(fs.stat)
const mkdirAsync = promisify(fs.mkdir)
const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)

function existsAsync (path: string) {
  return statAsync(path)
    .then(() => true)
    .catch(() => false)
}

const DATA_DIRNAME = 'com.soundcolorproject.server'
function getAppDataPath () {
  const home = os.homedir()
  const platform = os.platform()

  switch (platform) {
    case 'aix':
    case 'android':
    case 'freebsd':
    case 'linux':
    case 'netbsd':
    case 'openbsd':
    case 'sunos':
      const config = path.join(home, '.config')
      return path.join(config, DATA_DIRNAME)
    case 'cygwin':
    case 'win32':
      const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming')
      return path.join(appData, DATA_DIRNAME)
    case 'darwin':
      const appSupport = path.join(home, 'Library', 'Application Support')
      return path.join(appSupport, DATA_DIRNAME)
  }
}

const appDataPath = getAppDataPath()

export function dataFileExists (localPath: string) {
  const fullPath = path.join(appDataPath, localPath)

  return existsAsync(fullPath)
}

export async function writeDataFile (localPath: string, data: string | Buffer) {
  const fullPath = path.join(appDataPath, localPath)
  const dir = path.dirname(fullPath)

  if (!await existsAsync(dir)) {
    await mkdirAsync(dir, {
      recursive: true,
      mode: 0o700,
    })
  }

  await writeFileAsync(fullPath, data, {
    mode: 0o600,
  })
}

export async function readDataFile (localPath: string) {
  const fullPath = path.join(appDataPath, localPath)

  if (!await existsAsync(fullPath)) {
    return null
  }

  return readFileAsync(fullPath)
}

export async function writeJsonFile (localPath: string, data: any) {
  return writeDataFile(localPath, JSON.stringify(data))
}

export async function readJsonFile<T> (localPath: string): Promise<T | null> {
  const buffer = await readDataFile(localPath)
  if (buffer === null) {
    return null
  }

  return JSON.parse(buffer.toString())
}
