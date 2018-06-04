'use strict'

const path = require('path')
const here = path.resolve(__dirname)

const expect = require('chai').expect

const bundleDna = require('./bundle-dna').bundleDna

describe('bundle-dna Suite', () => {
  it('should be a function', () => {
    expect(typeof bundleDna).equals('function')
  })

  it('should throw if not dna folder', () => {
    expect(bundleDna).throws()
  })

  it('should bundle the test app', () => {
    const res = bundleDna(path.join(here, '../test'))
    expect(res.dna.Name).equals('test')
    expect(res.schemas.test['test.json'].title).equals('test')
  })
})
