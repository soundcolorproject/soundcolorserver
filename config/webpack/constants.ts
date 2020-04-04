
import * as path from 'path'

function resolve (givenPath: string) {
  return path.join(__dirname, '../..', givenPath)
}

export function buildConstants (dev: boolean) {
  return {
    entrypoint: dev
      ? resolve('site/index.dev.tsx')
      : resolve('site/index.tsx'),
    srcDir: resolve('site'),
    staticDir: resolve('static'),
    outputDir: resolve('dist/public'),
    tsconfig: resolve('tsconfig.json'),
    htmlPath: resolve('static/index.html'),
    outputJsFile: 'static/js/[name].[hash:8].js',
    outputJsChunkFiles: 'static/js/[name].[chunkhash:8].chunk.js',
    outputCssFile: 'static/css/[name].[contenthash:8].css',
    outputCssChunkFiles: 'static/css/[id].css',
  }
}

export type Constants = ReturnType<typeof buildConstants>
