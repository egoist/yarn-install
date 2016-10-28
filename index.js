/* eslint-disable camelcase */
'use strict'
const spawn = require('cross-spawn')

// const install = require('yarn-install)
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

  const getSpawnOptions = type => ({
    stdio,
    cwd,
    env: getEnv(opts, type)
  })

  let result = spawn.sync(
    'yarn',
    [yarnInstallType].concat(getArgs(deps, opts, 'yarn')),
    getSpawnOptions('yarn')
  )

  if (result.error && result.error.code === 'ENOENT') {
    result = spawn.sync(
      'npm',
      ['install'].concat(getArgs(deps, opts, 'npm')),
      getSpawnOptions('npm')
    )
  }

  return result
}

function getArgs(deps, opts, type) {
  const append = []
  if (opts.dev) {
    const arg = type === 'yarn' ? '-' : '--save'
    append.push(arg + '-dev')
  } else if (opts.global) {
    append.push('--global')
  } else if (type === 'npm') {
    append.push('--save')
  }
  return deps ? deps.concat(append) : []
}

function getEnv(opts, type) {
  const env = Object.assign({}, process.env)
  if (opts.registry) {
    if (type === 'yarn') env.yarn_registry = opts.registry
    else if (type === 'npm') env.npm_config_registry = opts.registry
  }
  return env
}
