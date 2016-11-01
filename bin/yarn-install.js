#!/usr/bin/env node
'use strict'
const cac = require('cac')
const chalk = require('chalk')
const install = require('../')

const cli = cac()

cli.usage(`Usage: ${chalk.yellow('yarn-install')} [dependencies] [options]`)

cli
  .option('d, dev', 'Install as dev dependency')
  .option('g, gloabl', 'Install as global dependency')
  .option('r, registry', 'Use custom registry')

cli.command('*', 'Run yarn install with npm fallback', (input, flags) => {
  let result
  if (input.length > 0) {
    result = install(input, flags)
  } else {
    result = install(flags)
  }
})

cli.parse()
