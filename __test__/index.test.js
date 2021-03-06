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
  fs.writeFileSync(path.join(fixture, 'package.json'), JSON.stringify({
    private: true,
    name: 'fixture'
  }, null, 2), 'utf8')
  return execa('rm', [
    '-rf',
    path.join(fixture, 'node_modules'),
    path.join(fixture, 'yarn.lock')
  ])
})

test('save', () => {
  install({
    deps: ['pokemon'],
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
  install({
    deps: ['pokemon'],
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
