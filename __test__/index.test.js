const path = require('path')
const execa = require('execa')
const Pkg = require('update-pkg')
const install = require('../')

const fixture = path.join(__dirname, 'fixture/')

const requireFixturePkg = () => {
  const file = path.join(fixture, 'package.json')
  return require(file)
}

const requireInFixture = name => require(path.join(fixture, 'node_modules', name))

afterEach(() => {
  return execa('rm', [
    '-rf',
    path.join(fixture, 'node_modules'),
    path.join(fixture, 'yarn.lock')
  ]).then(() => {
    const pkg = new Pkg(fixture)
    pkg.set('dependencies', undefined)
    pkg.set('devDependences', undefined)
    return pkg.save()
  })
})

test('save', () => {
  install(['pokemon'], {cwd: fixture, registry: 'https://registry.npm.taobao.org'})
  const pokemon = requireInFixture('pokemon')
  expect(pokemon.getName(147)).toBe('Dratini')
  const pkg = requireFixturePkg()
  expect(Object.keys(pkg.dependencies)).toEqual(['pokemon'])
})

test('save dev', () => {
  install(['pokemon'], {cwd: fixture, dev: true, registry: 'https://registry.npm.taobao.org'})
  const pokemon = requireInFixture('pokemon')
  expect(pokemon.getName(147)).toBe('Dratini')
  const pkg = requireFixturePkg()
  expect(Object.keys(pkg.devDependencies)).toEqual(['pokemon'])
})
