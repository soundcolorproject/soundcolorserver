
import * as Generator from 'yeoman-generator'
import * as fs from 'fs'
import * as path from 'path'

import { createPrompts } from '../../../helpers/createPrompts'
import { fixImports } from '../../../helpers/fixImports'
import { runTemplate } from '../../../helpers/runTemplate'

interface Answers {
  name: string
  directory: string
}

const TEMPLATES_DIR = path.join(__dirname, 'templates')
class ContainerGenerator extends Generator {
  private static readonly prompts = createPrompts<Answers>({
    name: {
      type: 'input',
      message: 'What would you like to name your container (should be CamelCase)?',
    },
    directory: {
      type: 'input',
      message: 'Where should the container be generated?',
      default: 'containers',
    },
  })

  private _templateDirFiles: string[]
  private _answers: Answers

  readTemplatesDir () {
    this._templateDirFiles = fs
      .readdirSync(TEMPLATES_DIR)
      .map(rel => path.join(TEMPLATES_DIR, rel))
      .filter(item => {
        const stats = fs.statSync(item)
        return stats.isFile()
      })
  }

  async promptUser () {
    this._answers = await this.prompt(ContainerGenerator.prompts) as Answers
  }

  generateModule () {
    const { name, directory } = this._answers
    const lowerName = name[0].toLowerCase() + name.substring(1)
    const UpperName = name[0].toUpperCase() + name.substring(1)
    const dashName = lowerName.replace(/[A-Z]/g, (char, idx) => {
      if (idx === 0) {
        return char
      } else {
        return `-${char.toLowerCase()}`
      }
    })

    const relativePath = path.join('site', directory, UpperName)
    const componentDir = this.destinationPath(relativePath)
    if (!fs.existsSync(componentDir)) {
      this.log('creating directory...')
      fs.mkdirSync(componentDir, { recursive: true })
    }
    this.log('generating files...')

    const templateContext = {
      lowerName,
      UpperName,
      'dash-name': dashName,
    }

    this._generateFiles(componentDir, relativePath, templateContext)
    this.log(`${relativePath} generated!`)
  }

  private _generateFiles (outputDir: string, relativePath: string, variables: any) {
    this._templateDirFiles.forEach(templateFilePath => {
      const template = fs.readFileSync(templateFilePath).toString()

      const fileName = runTemplate({
        template: path.basename(templateFilePath),
        variables,
        log: this.log,
      })
      let fileContent = runTemplate({
        template,
        variables,
        log: this.log,
      })

      if (/\.tsx?$/.test(fileName)) {
        fileContent = fixImports(fileContent, relativePath)
      }

      fs.writeFileSync(
        path.join(outputDir, fileName),
        fileContent,
      )
    })
  }
}

export = ContainerGenerator
