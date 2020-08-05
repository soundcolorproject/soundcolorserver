
import * as Generator from 'yeoman-generator'
import * as fs from 'fs'
import * as path from 'path'

import { createPrompts } from '../../../helpers/createPrompts'
import { fixRelativeImports, appendImport } from '../../../helpers/fixImports'
import { runTemplate } from '../../../helpers/runTemplate'

function existsSync (file: string) {
  try {
    fs.statSync(file)
    return true
  } catch (err) {
    return false
  }
}

interface Answers {
  url: string
}

function camelCase (name: string) {
  return name.replace(/-([a-z])/gi, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

const TEMPLATES_DIR = path.join(__dirname, 'templates')
const ROUTES_DIR = path.join(__dirname, '../../../../server/routes')
class ContainerGenerator extends Generator {
  private static readonly prompts = createPrompts<Answers>({
    url: {
      type: 'input',
      message: 'What is the URL for the new router?',
      default: '/api/example',
      validate (input: {} | string) {
        const inputStr = input.toString()
        if (!inputStr.startsWith('/')) {
          return 'The URL must begin with a /'
        }

        if (inputStr.endsWith('/')) {
          return 'The URL must not end with a /'
        }

        if (/\/\//.test(inputStr)) {
          return 'The URL must not have two consecutive slashes (//)'
        }

        if (/\/-/.test(inputStr)) {
          return `Path parts cannot start with a dash (${/\/-[a-z_-]+\/?/.exec(inputStr)?.[0]})`
        }

        if (/[^a-z_\/-]/.test(inputStr)) {
          return 'The URL must only contain slashes, lowercase letters, dashes, or underscores'
        }

        return true
      },
    },
  })

  private _answers: Answers
  private _urlPath: string
  private _camelCasePath: string
  private _pathParts: string[]
  private _camelPathParts: string[]

  async promptUser () {
    this._answers = await this.prompt(ContainerGenerator.prompts) as Answers
    this._urlPath = this._answers.url.substring(1)
    this._pathParts = this._urlPath.split('/')
    this._camelPathParts = this._pathParts.map(camelCase)
    this._camelCasePath = this._camelPathParts.join('/')

    this.log(`Preparing router (${this._camelCasePath}.ts)`)
  }

  generateDirectories () {
    const fullDirPath = path.join(ROUTES_DIR, this._camelPathParts.slice(0, -1).join('/'))
    this.log(`Creating directories (${fullDirPath})...`)
    fs.mkdirSync(fullDirPath, { recursive: true })
  }

  moveRoutersIfNecessary () {
    this.log('Checking to see if any routers need to move...')
    this._pathParts.forEach((_, i, parts) => {
      if (i === parts.length - 1) {
        return
      }
      const currentPath = parts.slice(0, i + 1).join('/')
      const possibleFile = path.join(ROUTES_DIR, `${currentPath}.ts`)
      const newFile = path.join(ROUTES_DIR, currentPath, `index.ts`)
      if (existsSync(possibleFile)) {
        if (existsSync(newFile)) {
          throw new Error(`The file ${newFile} already exists -- it should not!`)
        }

        this.log('Moving router...')
        this.log(`  from: ${possibleFile}`)
        this.log(`    to: ${newFile}`)
        const oldContent = fs.readFileSync(possibleFile).toString()
        const newContent = fixRelativeImports(oldContent, '../')
        fs.writeFileSync(newFile, newContent)
        fs.unlinkSync(possibleFile)
      }
    })
  }

  generateIntermediaryRouters () {
    this.log('Generating intermediary routers...')
    const template = fs.readFileSync(path.join(TEMPLATES_DIR, 'newIntermediateRouter.ts')).toString()
    this._pathParts.forEach((_, i, parts) => {
      if (i === parts.length - 1) {
        return
      }

      const parent = this._camelPathParts[i]
      const child = this._camelPathParts[i + 1]
      const childRoute = this._pathParts[i + 1]

      const currentPath = parts.slice(0, i + 1).join('/')
      const nextPath = parts.slice(0, i + 2).join('/')
      const currentRouter = path.join(ROUTES_DIR, currentPath, `index.ts`)
      const nextRouter = i < parts.length - 2
        ? path.join(ROUTES_DIR, nextPath, `index.ts`)
        : path.join(ROUTES_DIR, `${nextPath}.ts`)
      if (existsSync(currentRouter)) {
        if (existsSync(nextRouter)) {
          return
        }

        let content = fs.readFileSync(currentRouter).toString()
        content = appendImport(content, `import { ${child}Router } from './${child}'`)
        if (!content.endsWith('\n')) {
          content += '\n'
        }
        content += `${parent}Router.use('/${childRoute}', ${child}Router)\n`

        fs.writeFileSync(currentRouter, content)
      } else {
        this.log(`Generating new ${this._camelPathParts[i]} router...`)
        const content = runTemplate({
          template,
          variables: {
            parent,
            child,
          },
          log: this.log,
        })

        fs.writeFileSync(currentRouter, content)
      }
    })
  }

  generateTargetRouter () {
    this.log('Generating target router...')
    const location = path.join(ROUTES_DIR, `${this._camelCasePath}.ts`)
    this.log(`@ ${location}`)
    const template = fs.readFileSync(path.join(TEMPLATES_DIR, '$child.ts')).toString()
    const content = runTemplate({
      template,
      variables: { child: this._camelPathParts[this._camelPathParts.length - 1] },
      log: this.log,
    })
    fs.writeFileSync(location, content)
    this.log('Done!')
  }
}

export = ContainerGenerator
