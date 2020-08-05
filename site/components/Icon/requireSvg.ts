
if (__JEST__ === true && !require['context']) {
  const { join } = require('path')
  require['context'] = (prePath: string): any => {
    return (additionalPath: string) => require('./' + join(prePath, additionalPath))
  }
}

export const requireSvg = require.context('./svg', true, /\.svg/)
