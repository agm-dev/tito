/**
 *
 */
const tito = (function () {
  let rules = []
  let responseFormat = 'array'
  let validLogLevels = ['log', 'warn', 'error']

  function log (text, level = 'log') {
    if (validLogLevels.indexOf(level) !== -1 && typeof text === 'string' && text.length) {
      console[level](`[tito.js] ${text}`)
    }
  }

  function initialize (rulesArray) {
    if (!Array.isArray(rulesArray) || !rulesArray.length) {
      log('config object is not an array, or has length 0', 'error')
      return false
    }
    const invalidRulesArray = rulesArray.some(rule => {
      const invalid = (
        typeof rule !== 'object' ||
        !rule.hasOwnProperty('in') ||
        !rule.hasOwnProperty('out') ||
        (rule.in.constructor.name !== 'RegExp' && !Array.isArray(rule.in)) ||
        (typeof rule.out !== 'string' && !Array.isArray(rule.out) && typeof rule.out !== 'object') ||
        (typeof rule.out === 'string' && !rule.out.length) ||
      (typeof rule.out === 'object' && !Array.isArray(rule.out) && (!rule.out.hasOwnProperty('text') || typeof rule.out.text !== 'string' || !rule.out.text.length))
      )
      if (invalid) return true
      // check in array of regexs
      if (Array.isArray(rule.in)) {
        const invalidInArrayValues = rule.in.some(inRule => inRule.constructor.name !== 'RegExp')
        if (invalidInArrayValues) return true
      }
      // check out array of strings or valid objects
      if (Array.isArray(rule.out)) {
        const invalidOutArrayValues = rule.out.some(outRule => {
          return (
            (typeof outRule === 'string' && !outRule.length) ||
            (typeof outRule === 'object' && (!outRule.hasOwnProperty('text') || !outRule.hasOwnProperty('weight') || typeof outRule.text !== 'string' || !outRule.text.length || typeof outRule.weight !== 'number'))
          )
        })
        if (invalidOutArrayValues) return true
      }
      return false
    })

    if (invalidRulesArray) {
      log('config object has invalid structure. Check documentation to see valid configuration examples', 'error')
      return false
    }

    rules = [...rulesArray]
    return true
  }

  function process (text = '') {
    return ''
  }

  function getRules () {
    return rules
  }

  function getOptions () {
    return { responseFormat }
  }

  return {
    initialize,
    process,
    getRules,
    getOptions
  }
})()

module.exports = tito
