
const { join } = require('path')
require('@testing-library/jest-dom')

require.context = (prePath) => {
  return (additionalPath) => require(join(prePath, additionalPath))
}
