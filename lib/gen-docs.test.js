'use strict'

const expect = require('chai').expect

const lib = require('./index')

describe('gen-docs Suite', () => {
  it('should be a function', () => {
    expect(typeof lib.genDocs).equals('function')
  })

  it('should generate swagger-ui', () => {
    const ui = lib.genDocs({ test: 'fake-spec' })
    expect(ui.substr(0, 1000)).contains('<!DOCTYPE html>')
    expect(ui.substr(ui.length - 1000)).contains('#swagger-ui')
  })
})
