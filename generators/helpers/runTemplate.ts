
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

export function runTemplate (template: string, variables: VariableMap) {
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
    printPositions(template.split('\n'), unusedVariables)
  }

  return result
}

function printPositions (lines: string[], remainingVariables: string[]) {
  console.warn(' === Some variables in the template seem to be unused === ')

  lines.forEach((line, idx) => {
    const lineNumber = idx + 1
    remainingVariables.forEach(variable => {
      const linePosition = line.indexOf(variable)
      if (linePosition >= 0) {
        console.warn(`Variable ${variable} unused on ${lineNumber}:${linePosition} --`)
        console.warn(line)
        console.warn(positionCaret(linePosition))
        console.log()
      }
    })
  })

  console.log()
}

function positionCaret (position: number): string {
  const spaces = Array.from(new Array(position + 1)).join(' ')
  return `${spaces}^`
}
