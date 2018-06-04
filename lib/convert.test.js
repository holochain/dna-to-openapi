'use strict'

const expect = require('chai').expect

const lib = require('./index')

const BASIC = {
  Version: 1,
  Name: 'test',
  Properties: {
    description: 'test'
  },
  Zomes: [
    {
      Name: 'test',
      Description: 'test',
      Entries: [],
      Functions: []
    }
  ]
}

const BASIC_STRING = JSON.parse(JSON.stringify(BASIC))
BASIC_STRING.Zomes[0].Functions.push({
  Name: 'test',
  CallingType: 'string',
  ReturnType: 'string'
})

const BASIC_JSON = JSON.parse(JSON.stringify(BASIC))
BASIC_JSON.Zomes[0].Functions.push({
  Name: 'test',
  CallingType: 'json',
  ReturnType: 'json'
})

const CUSTOM_JSON = JSON.parse(JSON.stringify(BASIC))
CUSTOM_JSON.Zomes[0].Functions.push({
  Name: 'test',
  CallingType: 'json',
  InputSchemaFile: 'test.json',
  ReturnType: 'json',
  OutputSchemaFile: 'test.json'
})

const BASIC_RESULT = {
  'openapi': '3.0.0',
  'info': {
    'title': 'test',
    'description': 'test',
    'version': 1
  },
  'servers': 'removed',
  'paths': {
    '/test/test': {
      'post': null
    }
  }
}

const BASIC_RESULT_STRING = JSON.parse(JSON.stringify(BASIC_RESULT))
BASIC_RESULT_STRING.paths['/test/test'].post = {
  'tags': [
    'test'
  ],
  'summary': 'test test',
  'consumes': [
    'text/plain'
  ],
  'produces': [
    'text/plain'
  ],
  'requestBody': {
    'required': true,
    'content': {
      'text/plain': {
        'schema': {
          'type': 'string'
        }
      }
    }
  },
  'responses': {
    '200': {
      'description': 'success',
      'content': {
        'text/plain': {
          'schema': {
            'type': 'string'
          }
        }
      }
    }
  }
}

const BASIC_RESULT_JSON = JSON.parse(JSON.stringify(BASIC_RESULT))
BASIC_RESULT_JSON.paths['/test/test'].post = {
  'tags': [
    'test'
  ],
  'summary': 'test test',
  'consumes': [
    'application/json'
  ],
  'produces': [
    'application/json'
  ],
  'requestBody': {
    'required': true,
    'content': {
      'application/json': {
        'schema': {
          'title': 'Stub Schema',
          'type': 'object',
          'properties': {
            'stub': {
              'type': 'string'
            }
          }
        }
      }
    }
  },
  'responses': {
    '200': {
      'description': 'success',
      'content': {
        'application/json': {
          'schema': {
            'title': 'Stub Schema',
            'type': 'object',
            'properties': {
              'stub': {
                'type': 'string'
              }
            }
          }
        }
      }
    }
  }
}

const CUSTOM_RESULT_JSON = JSON.parse(JSON.stringify(BASIC_RESULT))
CUSTOM_RESULT_JSON.paths['/test/test'].post = {
  'tags': [
    'test'
  ],
  'summary': 'test test',
  'consumes': [
    'application/json'
  ],
  'produces': [
    'application/json'
  ],
  'requestBody': {
    'required': true,
    'content': {
      'application/json': {
        'schema': {
          'type': 'object',
          'title': 'test',
          'properties': {}
        }
      }
    }
  },
  'responses': {
    '200': {
      'description': 'success',
      'content': {
        'application/json': {
          'schema': {
            'type': 'object',
            'title': 'test',
            'properties': {}
          }
        }
      }
    }
  }
}

describe('dna-to-openapi Suite', () => {
  it('convert is a function', () => {
    expect(typeof lib.convert).equals('function')
  })

  it('should generate basic string types', () => {
    const res = lib.convert(BASIC_STRING, {
      schemas: {}
    })
    res.result.servers = 'removed'
    expect(res.result).deep.equals(BASIC_RESULT_STRING)
  })

  it('should generate basic json types (default schema)', () => {
    const res = lib.convert(BASIC_JSON, {
      schemas: {}
    })
    res.result.servers = 'removed'
    expect(res.result).deep.equals(BASIC_RESULT_JSON)
  })

  it('should generate basic json types (custom schema)', () => {
    const res = lib.convert(CUSTOM_JSON, {
      schemas: {
        test: {
          'test.json': {
            type: 'object',
            title: 'test',
            properties: {}
          }
        }
      }
    })
    res.result.servers = 'removed'
    expect(res.result).deep.equals(CUSTOM_RESULT_JSON)
  })
})
