const test = require('ava')
const tito = require('../src/tito')

const testRules = [
  {
    in: /(^|\W)test(\W|$)/,
    out: 'yeah, that matches our test regex'
  },
  {
    in: [
      /(^|\W)tist(\W|$)/,
      /(^|\W)tost(\W|$)/
    ],
    out: { weight: 20, text: 'this one has a 20% prob' }
  },
  {
    in: /(^|\W)tust(\W|$)/,
    out: [
      { weight: 20, text: 'this one has a 20% prob' },
      'this one should has a 80% prob'
    ]
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

test('initialize method returns false on invalid configuration', t => {
  t.false(tito.initialize(['test']))
  t.false(tito.initialize([{ text: 'test' }]))
  t.false(tito.initialize([{ in: 123, out: 456 }]))
  t.false(tito.initialize([{ in: /(^|\W)tist(\W|$)/ }]))
  t.false(tito.initialize([{ in: ['test'] }]))
  t.false(tito.initialize([{ out: /(^|\W)tist(\W|$)/ }]))
  t.false(tito.initialize([{ in: /(^|\W)tist(\W|$)/, out: ['test', { weight: 20, text: '' }] }]))
})

test('initialize method returns true on valid configuration', t => {
  t.true(tito.initialize(testRules))
})
