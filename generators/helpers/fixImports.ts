
import { relative } from 'path'

const importFinder = /^(\s*import(?:.* from)? ['"])((?:server|shared)\/.*)(['"]\s*)$/gm
export function fixImports (template: string, originPath: string): string {
  return template.replace(importFinder, (_, start, sitePath, end) => {
    const relativePath = relative(originPath, sitePath)
    return `${start}${relativePath}${end}`
  })
}
