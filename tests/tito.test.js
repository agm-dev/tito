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

test('tito has setOptions method', t => {
  t.true(typeof tito.setOptions === 'function')
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

test('process method only accepts string with length as input param', t => {
  let err, response
  [err, response] = tito.process(123)
  t.true(typeof err === 'string')
  t.true(response === null);
  [err, response] = tito.process([])
  t.true(typeof err === 'string')
  t.true(response === null);
  [err, response] = tito.process('abc')
  t.true(err === null)
  t.true(response === null);
  [err, response] = tito.process('')
  t.true(typeof err === 'string')
  t.true(response === null);
  [err, response] = tito.process({})
  t.true(typeof err === 'string')
  t.true(response === null);
  [err, response] = tito.process(null)
  t.true(typeof err === 'string')
  t.true(response === null);
  [err, response] = tito.process()
  t.true(typeof err === 'string')
  t.true(response === null)
})

test('process method returns an array response on valid input', t => {
  let err, response
  [err, response] = tito.process('test')
  t.true(err === null)
  t.true(response === testRules[0].out)
})

test('getOptions returns and object with options data', t => {
  const options = tito.getOptions()
  t.is(options.responseFormat, 'array')
  t.is(options.caseSensitive, false)
})

test('setOptions only accepts (return true) object with valid options as properties', t => {
  t.false(tito.setOptions('test'))
  t.false(tito.setOptions([]))
  t.false(tito.setOptions(123))
  t.true(tito.setOptions({}))
  t.false(tito.setOptions({ test: 'test' }))
  t.false(tito.setOptions({ responseFormat: null }))
  t.false(tito.setOptions({ responseFormat: 123 }))
  t.false(tito.setOptions({ responseFormat: {} }))
  t.false(tito.setOptions({ responseFormat: [] }))
  t.false(tito.setOptions({ responseFormat: 'test' }))
  t.true(tito.setOptions({ responseFormat: 'array' }))
  t.true(tito.setOptions({ responseFormat: 'object' }))
  t.true(tito.setOptions({ caseSensitive: true }))
  t.true(tito.setOptions({ caseSensitive: false }))
  t.false(tito.setOptions({ caseSensitive: 'test' }))
  t.false(tito.setOptions({ caseSensitive: [] }))
  t.false(tito.setOptions({ caseSensitive: {} }))
})

test('process method returns an object response when responseFormat === "object"', t => {
  tito.setOptions({ responseFormat: 'object' })
  const result = tito.process('test')
  t.true(result.hasOwnProperty('error'))
  t.true(result.hasOwnProperty('response'))
  t.true(result.error === null)
  t.true(result.response === testRules[0].out)
})

test('by default process method is not case sensitive', t => {
  const result = tito.process('TeSt')
  t.true(result.response === testRules[0].out)
})

test('caseSensitive option works', t => {
  const result = tito.process('TeSt')
  t.true(result.response === testRules[0].out)
  tito.setOptions({ caseSensitive: true })
  const result2 = tito.process('TeSt')
  t.false(result2.response === testRules[0].out)
})
