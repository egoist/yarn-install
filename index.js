'use strict'
const spawn = require('cross-spawn')

// const install = require('npm-or-yarn')
//
// with dependencies
// install(['webpack', 'ava'], {saveDev: true})
// install(['webpack', 'ava'], {save: true})
// install(['webpack', 'ava'], {global: true})
//
// omit dependencies
// it runs npm install or yarn install directly
// install(options)
module.exports = function (deps, opts) {
  // first argument is not an array
  // then treat it as opts
  if (!Array.isArray(deps)) {
    opts = deps
    deps = null
  }

  opts = opts || {}
  const cwd = opts.cwd
  const stdio = opts.stdio === undefined ? 'inherit' : opts.stdio

  const yarnInstallType = deps ? 'add' : 'install'

  const spawnOptions = {
    stdio,
    cwd
  }

  let result = spawn.sync(
    'yarn',
    [yarnInstallType].concat(getArgs(deps, opts, 'yarn')),
    spawnOptions
  )
  if (result.error && result.error.code === 'ENOENT') {
    result = spawn.sync(
      'npm',
      ['install'].concat(getArgs(deps, opts, 'npm')),
      spawnOptions
    )
  }

  return result
}

function getArgs(deps, opts, type) {
  const append = []
  if (opts.dev) {
    const arg = type === 'yarn' ? '-' : '--save'
    append.push(arg + '-dev')
  }
  if (opts.global) {
    append.push('--global')
  }
  return deps ? deps.concat(append) : []
}
