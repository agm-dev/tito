# TITO - Text In Text Out

Tito is a simple library that exports a configurable object capable of process input text data and produce text response if input data matches some of the configured rules.

### Installation:

```
npm install titojs --save
```

### Usage:

There is a whole example on examples folder.

Import the library:
```
const tito = require('titojs')
```

Define some rules and use `initialize` method to store those rules in tito object:
```
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

tito.initialize(rules)
```

Process some input data. Tito should return configured outputs on matching input text:
```
// These ones should log "I bet you didn't see Game of Thrones"
let err, response
[err, response] = tito.process('What do we say to the god of death? Not tomorrow.')
console.log(response);
[err, response] = tito.process('What do we say to the god of death? Not yesterday.')
console.log(response);

/* This one should return 20% "You will die this time, sorry" and 80% "That's what we say to the god of death" */
[err, response] = tito.process('The answer is "not today"')
console.log(response)
```

### Methods:

__initialize()__

This is used to set the rules. Rules is an array of objects. Each object is a rule. Each rule object must contain `in` and `out` properties.

`in` property can be a regular expression or an array of regular expressions.

`out` object is more complex. It can be string, object, array of strings, array of objects, or a mix. If it's an object, it must contain `weight` and `text` properties, where first one is integer type and second one is string type.

`weight` represents the probability of that option to be selected as result when input text matches that `in` rule.


__process()__

This is the main feature of tito. It is used to compare input text with rules array. If input text matches one of the rules, tito returns related output text.

This method can return an array `[error, response]` or an object `{ error, response }`

In both cases error will be null if input param is valid, and a string with error text otherwise. Response will contain the output string choice if there is a matching rule.


__getRules()__

This method returns an array with configured rules.


__getOptions()__

This method returns an object with options data.


__setOptions()__

This method requires an object with valid options and will set those options to the provided values.

## Contributions:

The `package.json` is configured to only allow commits that passes `standard` style rules, and defined tests. If you want to contribute to this package, clone this repo, run `npm install`, then start by writing your test. There is an example on `tests` folder.

Run `npm run dev`, so on saving changes all test will run.

If code passes `standard` rules and tests, feel free to send a pull request :)