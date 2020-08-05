#!/usr/bin/env node

const { join } = require('path')
const { utimesSync, openSync, closeSync } = require('fs')
const { execSync: exec, spawnSync: spawn } = require('child_process')
const jake = require('jake')
const { desc, file, fail, FileList, run } = jake

task('default', ['build'])

const depsList = new FileList()
depsList.include(join(__dirname, './generators/**/*.ts'))
depsList.include(join(__dirname, './generators/**/*.tsx'))
depsList.include(join(__dirname, './generators/**/*.pcss'))
depsList.include(join(__dirname, '../helpers/**/*.ts'))
depsList.include(join(__dirname, '../helpers/**/*.tsx'))

const deps = depsList.toArray()

desc('build the server generators')
file(join(__dirname, 'build'), deps, function build () {
  const tsc = join(exec('npm bin', { cwd: join(__dirname, '..') }).toString().trim(), 'tsc')
  const tscProcess = spawn(tsc, { stdio: 'inherit', cwd: __dirname })
  if (tscProcess.status !== 0) {
    fail(tscProcess.error || 'Failed to transpile TypeScript')
  } else {
    touch(join(__dirname, 'build'))
  }
})

task('build', [join(__dirname, 'build')])

function touch (filename) {
  const time = new Date()
  try {
    utimesSync(filename, time, time);
  } catch (_err) {
    closeSync(openSync(filename, 'w'));
  }
}

// Run `jake` if invoked as a program
if (!process.argv[1] || !process.argv[1].endsWith('jake')) {
  run.apply(jake, ['-f', __filename, ...process.argv.slice(2)])
}
