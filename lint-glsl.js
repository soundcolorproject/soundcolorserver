#!/usr/bin/env node

const { join } = require('path')
const { spawnSync } = require('child_process')
const glob = require('glob')
const files = glob.sync('./site/**/*.{vert,frag}')
const glslBinary = join(__dirname, 'bin/glslangValidator')

const result = spawnSync(glslBinary, files, { stdio: 'inherit' })

process.exit(result.status)
