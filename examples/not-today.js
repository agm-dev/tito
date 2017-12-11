/**
 * First of all, import the library.
 * For this test I use the src itself
 * so you can run the test just by typing
 * node not-today.js
 *
 * In your node script you will install
 * this as a package, so the lane you
 * have to use is:
 * const tito = require('tito')
 */
const tito = require('../src/tito')

/**
 * Custom rules:
 *
 * This is an array of objects which define
 * the behavior of tito
 *
 * in: regular expression used to test input
 * string passed to process method. It accepts
 * array of regular expressions
 *
 * out: the response tito returns when input
 * text matches in regex. It accepts string,
 * array of strings, object and mixed array of
 * strings and objects. Objects must have a
 * weight property (int) to indicate probability and
 * text property (string) to indicate the string
 * returned on match
 */
const rules = [
  {
    in: /(^|\W)not today(\W|$)/,
    out: [
        { weight: 20, text: 'You will die this time, sorry' },
        { weight: 80, text: "That's what we say to the god of death" }
    ]
  },
  {
    in: [
      /(^|\W)not tomorrow(\W|$)/,
      /(^|\W)not yesterday(\W|$)/
    ],
    out: "I bet you didn't see Game of Thrones..."
  }
]

/**
 * Initialize the object with your custom
 * rules. It should return true if rules object
 * follows the expected format. You can use a
 * variable to store the result of the method:
 * const initialized = tito.initialize(rules)
 * if (!initiazlized) ...
 */
tito.initialize(rules)

/**
 * Process input data, tito should return
 * configured outputs on matching input text
 */

 // These ones should log "I bet you didn't see Game of Thrones"
let err, response
[err, response] = tito.process('What do we say to the god of death? Not tomorrow.')
console.log(response);
[err, response] = tito.process('What do we say to the god of death? Not yesterday.')
console.log(response);

/**
 * This one should return 20% "You will die this time, sorry"
 * and 80% "That's what we say to the god of death"
 */
[err, response] = tito.process('The answer is "not today"')
console.log(response)

/**
 * If no matches, response will be empty string
 * If wrong input param, error won't be null
 */
if (!err) console.log('There is no error, as expected')

/**
 * You can use tito.setOptions({ responseFormat: 'object' })
 * and from then, tito.process() will return an object
 * with error and response properties.
 */
