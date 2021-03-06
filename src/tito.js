/**
 * Tito - Text in text out
 */
const tito = (function () {
  // Properties:
  let rules = []
  let responseFormat = 'array'
  let caseSensitive = false
  let validLogLevels = ['log', 'warn', 'error']

  /**
   * Prints a console output with text provided, using
   * the log level provided
   * @param {string} text
   * @param {string} level
   */
  function log (text, level = 'log') {
    if (validLogLevels.indexOf(level) !== -1 && typeof text === 'string' && text.length) {
      console[level](`[tito.js] ${text}`)
    }
  }

  /**
   * Sets rules with the provided rules array if passes validation
   * @param {array} rulesArray
   * @return {boolean}
   */
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

  /**
   * Checks that input param is present and is a valid string
   * or returns an error
   * @param {*} input
   * @returns {string} error
   */
  function checkProcessInput (input = null) {
    if (typeof input !== 'string' || !input.length) return 'required string as input param'
    return null
  }

  /**
   * Process provided text and return an array or object
   * with error and response
   * @param {*} text
   * @return {object, array} response
   */
  function process (text) {
    const error = checkProcessInput(text)
    if (error) return [error, null]
    let response = null
    let matches = false
    for (const i in rules) {
      if (Array.isArray(rules[i].in)) {
        for (const j in rules[i].in) {
          matches = inRuleMatches(rules[i].in[j], text)
          if (matches) {
            response = getOutResponse(rules[i].out)
            break
          }
        }
        if (matches) break // this is for breaking the first loop just before breaking the nested loop
      } else {
        matches = inRuleMatches(rules[i].in, text)
        if (matches) {
          response = getOutResponse(rules[i].out)
          break
        }
      }
    }

    if (responseFormat === 'object') return { error: error, response: response }
    // returnFormat === 'array' by default:
    return [error, response]
  }

  /**
   * Checks if provided text matches provided rule
   * @param {*} inRule
   * @return {boolean} matches
   */
  function inRuleMatches (inRule, text) {
    let matches = false
    const options = caseSensitive ? 'mg' : 'img'
    try {
      matches = (new RegExp(inRule, options)).test(text)
    } catch (err) {
      log(err, 'warn')
    }
    return matches
  }

  /**
   * Checks the type of out param and makes a choice
   * @param {*} out
   * @returns {string}
   */
  function getOutResponse (out) {
    if (typeof out === 'string') return out
    if (typeof out === 'object' && out.hasOwnProperty('text') && typeof out.text === 'string') return out.text
    if (Array.isArray(out)) {
      let probabilityPool = 100
      const probabilityTable = []
      const outWeight = out.filter(item => (typeof item.weight === 'number' && item.weight <= probabilityPool))
      const outPlain = out.filter(item => (typeof item.weight !== 'number' || item.weight > probabilityPool))
      for (let i = 0; i < outWeight.length; i++) {
        const w = outWeight[i].weight
        const range = 100 - probabilityPool + w
        probabilityTable.push([range, outWeight[i].text])
        probabilityPool -= w
        if (probabilityPool <= 0) break
      }
      if (probabilityPool > 0) {
        const linearProb = probabilityPool / outPlain.length
        for (let i = 0; i < outPlain.length; i++) {
          const range = 100 - probabilityPool + linearProb
          const text = typeof outPlain === 'string' ? outPlain : outPlain.text
          probabilityTable.push([range, text])
          probabilityPool -= linearProb
        }
      }
      log(JSON.stringify(probabilityTable), 'info')
      // get response randomly using created table:
      const random = Math.floor(Math.random() * 100) + 1 // random number 1-100
      for (var i = 0; i < probabilityTable.length; i++) {
        if (random <= probabilityTable[i][0]) {
          return probabilityTable[i][1]
        }
      }
    }
  }

  /**
   * Return object with current configured rules
   * @return {object} rules
   */
  function getRules () {
    return rules
  }

  /**
   * Returns object with options data
   * @return {object} options
   */
  function getOptions () {
    return {
      responseFormat,
      caseSensitive
    }
  }

  /**
   * Set new options values
   * @param {object} options
   * @return {boolean}
   */
  function setOptions (options) {
    if (typeof options !== 'object' || Array.isArray(options)) return false
    const keys = Object.keys(options)
    const validKeys = ['responseFormat', 'caseSensitive']
    const allKeysAreValid = keys.every(key => validKeys.includes(key))
    if (!allKeysAreValid) return false
    if (options.hasOwnProperty('responseFormat')) {
      if (['array', 'object'].indexOf(options.responseFormat) !== -1) {
        responseFormat = options.responseFormat
        log(`set option responseFormat to ${options.responseFormat}`, 'log')
      } else {
        log(`set option reesponseFormat has to be 'array' or 'object'`, 'error')
        return false
      }
    }
    if (options.hasOwnProperty('caseSensitive')) {
      if (typeof options.caseSensitive === 'boolean') {
        caseSensitive = options.caseSensitive
        log(`set option caseSensitive to ${options.caseSensitive.toString()}`, 'log')
      } else {
        log(`set option caseSensitive has to be boolean`, 'error')
        return false
      }
    }
    return true
  }

  // Public api:
  return {
    initialize,
    process,
    getRules,
    getOptions,
    setOptions
  }
})()

module.exports = tito
