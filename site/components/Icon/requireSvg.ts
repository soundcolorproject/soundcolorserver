
// import requireContext from 'require-context.macro'

if (!require['context']) {
  const { join } = require('path')
  require['context'] = (prePath: string): any => {
    return (additionalPath: string) => require('./' + join(prePath, additionalPath))
  }
}

export const requireSvg = require.context('./svg', true, /\.svg/)
