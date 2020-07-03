
import { relative } from 'path'

const importFinder = /^(\s*import(?:.* from)? ['"])(site\/.*)(['"]\s*)$/gm
export function fixSiteImports (template: string, originPath: string): string {
  return template.replace(importFinder, (_, start, sitePath, end) => {
    const relativePath = relative(originPath, sitePath)
    return `${start}${relativePath}${end}`
  })
}
