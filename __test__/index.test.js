const fs = require('fs')
const path = require('path')
const execa = require('execa')
const req = require('require-uncached')
const install = require('../')

const fixture = path.join(__dirname, 'fixture/')

const requireFixturePkg = () => {
  const file = path.join(fixture, 'package.json')
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

const requireInFixture = name => req(path.join(fixture, 'node_modules', name))

afterEach(() => {
  return execa('rm', [
    '-rf',
    path.join(fixture, 'package.json'),
    path.join(fixture, 'node_modules'),
    path.join(fixture, 'yarn.lock')
  ])
})

test('save', () => {
  install(['pokemon'], {
    cwd: fixture,
    registry: 'https://registry.npm.taobao.org',
    showCommand: true
  })
  const pokemon = requireInFixture('pokemon')
  expect(pokemon.getName(147)).toBe('Dratini')
  const pkg = requireFixturePkg()
  expect(Object.keys(pkg.dependencies)).toEqual(['pokemon'])
})

test('save dev', () => {
  install(['pokemon'], {
    cwd: fixture,
    dev: true,
    registry: 'https://registry.npm.taobao.org',
    showCommand: true
  })
  const pokemon = requireInFixture('pokemon')
  expect(pokemon.getName(147)).toBe('Dratini')
  const pkg = requireFixturePkg()
  expect(Object.keys(pkg.devDependencies)).toEqual(['pokemon'])
})
