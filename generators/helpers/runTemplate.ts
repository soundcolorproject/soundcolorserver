
export const templateOpts = {
  detecter: /\$\w+\+?/,
  matcher: /\$(\w+)\+?/g,
  start: '$',
  end: '',
}

export interface VariableMap {
  [variable: string]: string
}

export interface RemainingVariable {
  variableName: string
  stringPosition: number
}

const variableFinder = /(\$\w+)/g

interface TemplateOptions {
  template: string
  variables: VariableMap
  log: (message?: string, context?: any) => void
}
export function runTemplate ({ template, variables, log }: TemplateOptions) {
  let result = template
  Object.keys(variables).forEach(variable => {
    const value = variables[variable]
    result = result.replace(new RegExp(`\\$${variable}`, 'g'), value)
  })

  const unusedVariables: string[] = []
  let match = variableFinder.exec(result)
  while (match !== null) {
    const variableName = match[1]
    if (!unusedVariables.includes(variableName)) {
      unusedVariables.push(variableName)
    }
    match = variableFinder.exec(result)
  }

  if (unusedVariables.length > 0) {
    printPositions({
      lines: template.split('\n'),
      unusedVariables,
      log,
    })
  }

  return result
}

interface PrintPositionOpts {
  lines: string[]
  unusedVariables: string[]
  log: (message?: string, context?: any) => void
}
function printPositions ({ lines, unusedVariables, log }: PrintPositionOpts) {
  log(' === Some variables in the template seem to be unused === ')
  log(new Error().stack?.split('\n').slice(3).join('\n'))

  lines.forEach((line, idx) => {
    const lineNumber = idx + 1
    unusedVariables.forEach(variable => {
      const linePosition = line.indexOf(variable)
      if (linePosition >= 0) {
        log(`Variable ${variable} unused on ${lineNumber}:${linePosition} --`)
        log(line)
        log(positionCaret(linePosition))
        log()
      }
    })
  })

  log()
}

function positionCaret (position: number): string {
  const spaces = Array.from(new Array(position + 1)).join(' ')
  return `${spaces}^`
}
