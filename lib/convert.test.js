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
  Description: 'test',
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
    'description': 'removed',
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
  'summary': 'test',
  'description': 'test',
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
    },
    'default': {
      'content': {
        'application/json': {
          'schema': {
            'type': 'object'
          }
        },
        'text/plain': {
          'schema': {
            'type': 'string'
          }
        }
      },
      'description': 'Error'
    }
  }
}

const BASIC_RESULT_JSON = JSON.parse(JSON.stringify(BASIC_RESULT))
BASIC_RESULT_JSON.paths['/test/test'].post = {
  'tags': [
    'test'
  ],
  'summary': 'test',
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
    },
    'default': {
      'content': {
        'application/json': {
          'schema': {
            'type': 'object'
          }
        },
        'text/plain': {
          'schema': {
            'type': 'string'
          }
        }
      },
      'description': 'Error'
    }
  }
}

const CUSTOM_RESULT_JSON = JSON.parse(JSON.stringify(BASIC_RESULT))
CUSTOM_RESULT_JSON.paths['/test/test'].post = {
  'tags': [
    'test'
  ],
  'summary': 'test',
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
    },
    'default': {
      'content': {
        'application/json': {
          'schema': {
            'type': 'object'
          }
        },
        'text/plain': {
          'schema': {
            'type': 'string'
          }
        }
      },
      'description': 'Error'
    }
  }
}

describe('dna-to-openapi Suite', () => {
  let res

  const exec = function exec (dna, opts) {
    res = lib.convert(dna, opts)
    res.result.info.description = 'removed'
    res.result.servers = 'removed'
  }

  it('convert is a function', () => {
    expect(typeof lib.convert).equals('function')
  })

  it('should generate basic string types', () => {
    exec(BASIC_STRING, {
      schemas: {}
    })
    expect(res.result).deep.equals(BASIC_RESULT_STRING)
  })

  it('should generate basic json types (default schema)', () => {
    exec(BASIC_JSON, {
      schemas: {}
    })
    expect(res.result).deep.equals(BASIC_RESULT_JSON)
  })

  it('should generate basic json types (custom schema)', () => {
    exec(CUSTOM_JSON, {
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
    expect(res.result).deep.equals(CUSTOM_RESULT_JSON)
  })
})
