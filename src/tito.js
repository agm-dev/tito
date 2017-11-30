/**
 *
 */
const tito = (function () {
  let rules = []
  let responseFormat = 'array'

  function initialize (rulesArray) {
    rules = [...rulesArray]
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
