/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This Webpack plugin ensures `npm install <library>` forces a project rebuild.
// We’re not sure why this isn't Webpack's default behavior.
// See https://github.com/facebook/create-react-app/issues/186.

'use strict'

export class WatchMissingNodeModulesPlugin {
  constructor (
    public nodeModulesPath = 'node_modules',
  ) {}

  apply (compiler: any) {
    compiler.hooks.emit.tap('WatchMissingNodeModulesPlugin', (compilation: any) => {
      const missingDeps: string[] = Array.from(compilation.missingDependencies)
      const nodeModulesPath = this.nodeModulesPath

      // If any missing files are expected to appear in node_modules...
      if (missingDeps.some(file => file.includes(nodeModulesPath))) {
        // ...tell webpack to watch node_modules recursively until they appear.
        compilation.contextDependencies.add(nodeModulesPath)
      }
    })
  }
}
