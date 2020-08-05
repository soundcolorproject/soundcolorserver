
import { readFile } from 'fs'
import * as postcss from 'postcss'

import { pcssPlugins } from '../config/pcssPlugins'
import { sleep } from '../electron/helpers'

const pcss = postcss(pcssPlugins)

const readFileAsync = (path: string) => (
  new Promise<Buffer>((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err || !data) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
)

export async function loadStyles (path: string, document = window.document) {
  const content = await readFileAsync(path)
  // tslint:disable-next-line: await-promise
  const compiled = await pcss.process(content, { from: path })
  const el = document.createElement('style')
  el.media = 'text/css'
  el.textContent = compiled.css
  document.head.appendChild(el)
  await sleep(100)
  return el
}
