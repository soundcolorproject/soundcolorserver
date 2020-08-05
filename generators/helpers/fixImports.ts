
import { relative } from 'path'

const specialImportFinder = /^(\s*import(?:.* from)? ['"])((?:server|shared|site)\/.*)(['"];?\s*)$/gm
export function fixImports (template: string, originPath: string): string {
  return template.replace(specialImportFinder, (_, start, sitePath, end) => {
    const relativePath = relative(originPath, sitePath)
    return `${start}${relativePath}${end}`
  })
}

const relativeImportFinder = /^(\s*import(?:.* from) ['"])(\.\/|\.\.\/)(.*['"];?\s*)$/gm
export function fixRelativeImports (template: string, fixer: string): string {
  return template.replace(relativeImportFinder, (_, start, pathStart, end) => {
    if (pathStart === './') {
      return `${start}${fixer}${end}`
    } else {
      return `${start}${fixer}${pathStart}${end}`
    }
  })
}

const importStatementFinder = /import\s+['"][^'"]+['"]|import\s+\*\s+as\s+\w+\s+from\s+['"][^'"]+['"]|import\s+\{[^\}]*\}\s+from\s+['"][^'"]+['"]/g
export function appendImport (template: string, importStatement: string) {
  let lastFind: RegExpExecArray | null = importStatementFinder.exec(template)
  let nextFind = importStatementFinder.exec(template)
  while (nextFind) {
    lastFind = nextFind
    nextFind = importStatementFinder.exec(template)
  }

  if (!lastFind) {
    return `${importStatement}\n${template}`
  } else {
    const index = lastFind.index + lastFind[0].length
    return `${template.substring(0, index)}\n${importStatement}${template.substring(index)}`
  }
}
