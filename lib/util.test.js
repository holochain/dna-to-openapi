'use strict'

const expect = require('chai').expect

const util = require('./util')

const FIXTURE = { a: { b: { c: [ { d: 'test' } ] } } }

describe('util Suite', () => {
  describe('get', () => {
    it('simple should return correct', () => {
      expect(util.get(FIXTURE, 'a.b.c.0.d')).equals('test')
    })

    it('undefined should return default', () => {
      expect(util.get(FIXTURE, 'not.there', 'test2')).equals('test2')
    })
  })
})
