
const { join } = require('path')
require('ts-node').register({
  project: join(__dirname, '../../tsconfig.test.json')
})

const JSDOMEnvironment = require('jest-environment-jsdom')
const { loadStyles } = require('../../shared/loadStyles')

class CustomEnvironment extends JSDOMEnvironment {
  async setup () {
    this.style = await loadStyles(join(__dirname, '../../site/global-css/index.pcss'), this.global.document)  
  }

  async teardown () {
    super.teardown()
    if (this.style) {
      this.style.remove()
    }
  }
}

module.exports = CustomEnvironment
