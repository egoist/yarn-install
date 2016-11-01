/* eslint-disable camelcase */
'use strict'
const spawn = require('cross-spawn')

// cache the install check result
let yarnInstalled

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
//
// remove dependencies
// install(['webpack'], {remove: true})
// install(['webpack'], {remove: true, global: true})
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

  const isYarn = yarnInstalled === undefined ?
    checkYarnInstalled() :
    yarnInstalled

  const command = isYarn ? 'yarn' : 'npm'

  let args
  if (isYarn) {
    args = getArgs({
      // yarn global
      global: opts.global,
      // yarn add
      add: deps && !opts.remove,
      // yarn install
      install: !deps && !opts.remove,
      // yarn remove
      remove: opts.remove,
      // yarn --dev
      '--dev': opts.dev
    })
  } else {
    args = getArgs({
      // npm install
      install: !opts.remove,
      // npm uninstall
      uninstall: opts.remove,
      '--save': !opts.dev && !opts.global,
      // npm --save0dev
      '--save-dev': opts.dev,
      // npm --global
      '--global': opts.global
    })
  }

  if (deps) {
    args = args.concat(deps)
  }

  if (opts.showCommand) {
    console.log('>', command, args.join(' '))
  }

  const result = spawn.sync(command, args, {
    stdio,
    cwd,
    env: getEnv(opts, isYarn)
  })

  // set the error code
  // make sure the same behavior as in yarn and npm
  if (result.status !== 0) process.exitCode = result.status

  return result
}

function checkYarnInstalled() {
  const command = spawn.sync('yarn', ['--version'])
  const installed = command.stdout && command.stdout.toString().trim()
  yarnInstalled = installed
  return installed
}

function getArgs(obj) {
  return Object.keys(obj).filter(name => obj[name])
}

function getEnv(opts, isYarn) {
  const env = Object.assign({}, process.env)
  if (opts.registry) {
    if (isYarn) env.yarn_registry = opts.registry
    else env.npm_config_registry = opts.registry
  }
  return env
}
