'use strict'

const lint = require('./dna-lint').lint
const _get = require('./util').get

/**
 * @param {object} opts
 * @param {string} [opts.title]
 * @param {string} [opts.description]
 * @param {string} [opts.version]
 */
function _genTop (opts) {
  return {
    openapi: '3.0.0',
    info: {
      title: opts.title,
      description: opts.description,
      version: opts.version
    },
    servers: [
      {
        url: 'http://{host}:{port}/fn',
        variables: {
          host: {
            default: '127.0.0.1'
          },
          port: {
            default: '10001'
          }
        }
      }
    ],
    paths: {}
  }
}

// incase a schema is not defined
const STUB_SCHEMA = {
  title: 'Stub Schema',
  type: 'object',
  properties: {
    stub: {
      type: 'string'
    }
  }
}

/**
 * @param {object} opts
 * @param {array<string>} [opts.tags]
 * @param {string} [opts.summary]
 * @param {string} [opts.consumes]
 * @param {string} [opts.produces]
 * @param {object} [opts.inSchema]
 * @param {object} [opts.outSchema]
 */
function _genPath (opts) {
  const out = {
    tags: opts.tags,
    summary: opts.summary,
    consumes: [opts.consumes],
    produces: [opts.produces]
  }

  if (opts.consumes === 'application/json') {
    out.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: opts.inSchema || STUB_SCHEMA
        }
      }
    }
  } else {
    out.requestBody = {
      required: true,
      content: {
        'text/plain': {
          schema: {
            type: 'string'
          }
        }
      }
    }
  }

  if (opts.produces === 'application/json') {
    out.responses = {
      200: {
        description: 'success',
        content: {
          'application/json': {
            schema: opts.outSchema || STUB_SCHEMA
          }
        }
      }
    }
  } else {
    out.responses = {
      200: {
        description: 'success',
        content: {
          'text/plain': {
            schema: {
              type: 'string'
            }
          }
        }
      }
    }
  }

  return {
    post: out
  }
}

/**
 * convert a dna file into a swagger api spec
 * @param {object} dna - the holochain dna spec
 * @param {object} opts
 * @param {string} [opts.host] the host, i.e. '127.0.0.1:3141'
 */
exports.convert = function convert (dna, opts) {
  const out = lint(dna, opts)

  out.result = _genTop({
    title: _get(dna, 'Name', ''),
    description: _get(dna, 'Properties.description', ''),
    version: _get(dna, 'Version', '0')
  })

  for (let zome of _get(dna, 'Zomes', [])) {
    const zname = _get(zome, 'Name')
    for (let fn of _get(zome, 'Functions', [])) {
      const fname = _get(fn, 'Name')
      const consumes = _get(fn, 'CallingType') === 'json'
        ? 'application/json'
        : 'text/plain'
      const produces = _get(fn, 'ReturnType') === 'json'
        ? 'application/json'
        : 'text/plain'
      const schemas = _get(opts, 'schemas.' + zname, {})
      let inSchema = _get(fn, 'InputSchemaFile')
      if (inSchema && inSchema in schemas) {
        inSchema = schemas[inSchema]
      }
      let outSchema = _get(fn, 'OutputSchemaFile')
      if (outSchema && outSchema in schemas) {
        outSchema = schemas[outSchema]
      }

      out.result.paths['/' + zname + '/' + fname] = _genPath({
        tags: [zname],
        summary: _get(zome, 'Description', '') + ' ' + fname,
        consumes: consumes,
        produces: produces,
        inSchema: inSchema,
        outSchema: outSchema
      })
    }
  }

  return out
}
