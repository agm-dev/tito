const test = require('ava')
const tito = require('../src/tito')

const testRules = [
  {
    in: /(^|\W)test(\W|$)/,
    out: 'yeah, that matches our test regex'
  }
]

test('tito has method initialize', t => {
  t.true(typeof tito.initialize === 'function')
})

test('tito has process method', t => {
  t.true(typeof tito.process === 'function')
})

test('tito has getRules method', t => {
  t.true(typeof tito.getRules === 'function')
})

test('tito has getOptions method', t => {
  t.true(typeof tito.getOptions === 'function')
})

test('getRules returns an array of rules objects', t => {
  const rules = tito.getRules()
  t.is(Array.isArray(rules), true)
  t.is(rules.length, 0)
  tito.initialize(testRules)
  const updatedRules = tito.getRules()
  t.is(Array.isArray(updatedRules), true)
  t.is(updatedRules.length, testRules.length)
  updatedRules.map(rule => {
    t.is(typeof rule.in !== 'undefined', true)
    t.is(typeof rule.out !== 'undefined', true)
  })
})

test('initialize method configures rules', t => {
  tito.initialize(testRules)
  const rules = tito.getRules()
  t.deepEqual(rules, testRules)
})
