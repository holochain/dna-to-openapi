'use strict'

const expect = require('chai').expect

const lib = require('./index')

const RE_UI_MATCH = [
  /<!DOCTYPE html>/,
  /fake-spec/,
  /#swagger-ui/
]

describe('gen-docs Suite', () => {
  it('should be a function', () => {
    expect(typeof lib.genDocs).equals('function')
  })

  it('should generate swagger-ui', () => {
    const ui = lib.genDocs({ test: 'fake-spec' })
    // turns out expect().contains() is way to slow for this large a string
    // use regexes instead
    for (let re of RE_UI_MATCH) {
      expect(re.test(ui)).equals(true, 'did not match ' + re.toString())
    }
  })
})
