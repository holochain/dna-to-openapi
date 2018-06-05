'use strict'

const expect = require('chai').expect

const lint = require('./index').lint

const DNA_BASIC = {
  Version: 1,
  Name: 'hello',
  Properties: {
    description: ''
  },
  Zomes: []
}

const ZOME_BASIC = [
  {
    Name: 'Z1',
    Description: 'Z1',
    Entries: [],
    Functions: []
  }
]

const SCHEMA_BASIC = {
  type: 'object',
  title: 'title',
  properties: {
    req: {
      type: 'string'
    },
    oth: {
      type: 'string'
    }
  },
  required: ['req']
}

const ENTRY_BASIC = [
  {
    Name: 'E1',
    DataFormat: 'json',
    SchemaFile: 'test.json'
  },
  {
    Name: 'E2',
    DataFormat: 'string'
  }
]

const FUNCTION_BASIC = [
  {
    Name: 'F1',
    CallingType: 'json',
    ReturnType: 'json',
    InputSchemaFile: 'test.json',
    OutputSchemaFile: 'test.json'
  },
  {
    Name: 'F2',
    CallingType: 'string',
    ReturnType: 'string'
  }
]

function _clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

describe('dna-lint Suite', () => {
  let dna, opts, res

  const _exec = () => {
    res = lint(dna, opts)
  }

  beforeEach(() => {
    dna = _clone(DNA_BASIC)
    opts = {
      schemas: {
        'Z1': {
          'test.json': _clone(SCHEMA_BASIC)
        }
      }
    }
  })

  it('lint is a function', () => {
    expect(typeof lint).equals('function')
  })

  it('should pass if basic', () => {
    _exec()
    expect(res.warnings.length).equals(0)
    expect(res.errors.length).equals(0)
  })

  it('should pass if basic (no opts)', () => {
    opts = null
    _exec()
    expect(res.warnings.length).equals(0)
    expect(res.errors.length).equals(0)
  })

  it('should error if no "Version"', () => {
    delete dna.Version
    _exec()
    expect(res.errors.length).equals(1)
  })

  it('should error if no "Name"', () => {
    delete dna.Name
    _exec()
    expect(res.errors.length).equals(1)
  })

  it('should error if bad "Zomes" type', () => {
    dna.Zomes = 'test'
    _exec()
    expect(res.errors.length).equals(1)
  })

  it('should warn if no "Properties.description"', () => {
    dna.Properties = null
    _exec()
    expect(res.warnings.length).equals(1)
  })

  it('should warn if bad "Properties.description"', () => {
    dna.Properties = 42
    _exec()
    expect(res.warnings.length).equals(1)
  })

  describe('Zomes', () => {
    beforeEach(() => {
      dna.Zomes = _clone(ZOME_BASIC)
    })

    it('should pass with zomes', () => {
      _exec()
      expect(res.warnings.length).equals(0)
      expect(res.errors.length).equals(0)
    })

    it('should error if no "Zome.Name"', () => {
      delete dna.Zomes[0].Name
      _exec()
      expect(res.errors.length).equals(1)
    })

    it('should error if bad "Zome.Entries"', () => {
      dna.Zomes[0].Entries = 'test'
      _exec()
      expect(res.errors.length).equals(1)
    })

    it('should error if bad "Zome.Functions"', () => {
      dna.Zomes[0].Functions = 'test'
      _exec()
      expect(res.errors.length).equals(1)
    })

    it('should warn if no "Zome.Description"', () => {
      delete dna.Zomes[0].Description
      _exec()
      expect(res.warnings.length).equals(1)
    })

    describe('Entries', () => {
      beforeEach(() => {
        dna.Zomes[0].Entries = _clone(ENTRY_BASIC)
      })

      it('should pass with entries', () => {
        _exec()
        expect(res.warnings.length).equals(0)
        expect(res.errors.length).equals(0)
      })

      it('should error if no "Entry.Name"', () => {
        delete dna.Zomes[0].Entries[0].Name
        _exec()
        expect(res.errors.length).equals(1)
      })

      it('should error if bad "Entry.DataFormat"', () => {
        dna.Zomes[0].Entries[0].DataFormat = 'bad'
        _exec()
        expect(res.errors.length).equals(1)
      })

      it('should error if json and no SchemaFile', () => {
        dna.Zomes[0].Entries[0].DataFormat = 'json'
        delete dna.Zomes[0].Entries[0].SchemaFile
        _exec()
        expect(res.errors.length).equals(1)
      })
    })

    describe('Schema Check', () => {
      beforeEach(() => {
        dna.Zomes[0].Entries = _clone(ENTRY_BASIC)
      })

      it('should pass', () => {
        _exec()
        expect(res.warnings.length).equals(0)
        expect(res.errors.length).equals(0)
      })

      it('should error if no schema', () => {
        opts.schemas.Z1['test.json'] = null
        _exec()
        expect(res.errors.length).equals(1)
      })

      it('should error if bad required', () => {
        opts.schemas.Z1['test.json'].required = ['bad']
        _exec()
        expect(res.errors.length).equals(1)
      })

      it('should warn if no title', () => {
        delete opts.schemas.Z1['test.json'].title
        _exec()
        expect(res.warnings.length).equals(1)
      })
    })

    describe('Functions', () => {
      beforeEach(() => {
        dna.Zomes[0].Functions = _clone(FUNCTION_BASIC)
      })

      it('should pass with entries', () => {
        _exec()
        expect(res.warnings.length).equals(0)
        expect(res.errors.length).equals(0)
      })

      it('should error if no "Function.Name"', () => {
        delete dna.Zomes[0].Functions[0].Name
        _exec()
        expect(res.errors.length).equals(1)
      })

      it('should error if bad "Function.CallingType"', () => {
        dna.Zomes[0].Functions[0].CallingType = 'bad'
        _exec()
        expect(res.errors.length).equals(1)
      })

      it('should warn if bad "Function.ReturnType"', () => {
        dna.Zomes[0].Functions[0].ReturnType = 'bad'
        _exec()
        expect(res.warnings.length).equals(1)
      })

      it('should warn if json CallingType and bad InputSchemaFile', () => {
        dna.Zomes[0].Functions[0].CallingType = 'json'
        delete dna.Zomes[0].Functions[0].InputSchemaFile
        _exec()
        expect(res.warnings.length).equals(1)
      })

      it('should warn if json ReturnType and bad OutputSchemaFile', () => {
        dna.Zomes[0].Functions[0].ReturnType = 'json'
        delete dna.Zomes[0].Functions[0].OutputSchemaFile
        _exec()
        expect(res.warnings.length).equals(1)
      })
    })
  })
})
