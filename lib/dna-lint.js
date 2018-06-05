'use strict'

const DATA_FORMATS = [
  'json',
  'string',
  'links'
]

/**
 * Check a holochain dna file for compatibility with dna-to-swagger
 * Produces warnings and errors
 * @param {object} dna - the holochain dna to check
 * @return {object{warnings: [], errors: []}}
 */
exports.lint = function lint (dna, opts) {
  opts || (opts = {})

  const out = {
    warnings: [],
    errors: []
  }

  const schemas = opts.schemas || {}

  const _out = function _out (arr, expr, msg, _for) {
    if (!expr) {
      if (_for) {
        msg += ' for "' + _for + '"'
      }
      arr.push(msg)
    }
  }

  const err = function err (expr, msg, _for) {
    _out(out.errors, expr, msg, _for)
  }

  const warn = function warn (expr, msg, _for) {
    _out(out.warnings, expr, msg, _for)
  }

  const validateSchema = function validateSchema (lvl, schema, zname, sname) {
    sname = 'opts.schemas.' + zname + "['" + sname + "']"

    // -- schema "errors" (if lvl is set to err) -- //
    lvl(schema && typeof schema === 'object', 'schema must be an object', sname)
    if (!schema || typeof schema !== 'object') {
      return
    }

    if (Array.isArray(schema.required)) {
      for (let required of schema.required) {
        lvl(required in schema.properties,
          'required property "' + required + '" not found', sname)
      }
    }

    // -- schema warnings (even if lvl is set to err) -- //
    warn(typeof schema.title === 'string',
      'schema.title should be a string', sname)
  }

  // -- top level errors -- //
  err(typeof dna === 'object', 'dna must be a json object')
  err('Version' in dna, '"Version" must exist as a top-level property')
  err(typeof dna.Name === 'string',
    '"Name" must be a string as a top-level property')
  err(Array.isArray(dna.Zomes),
    '"Zomes" must be an array as a top-level property')

  // -- top level warnings -- //
  warn(typeof (dna.Properties || {}).description === 'string',
    '"description" should be a string in the "Properties" top-level object')

  if (!Array.isArray(dna.Zomes)) {
    return out
  }

  // -- zomes checking -- //
  for (let zome of dna.Zomes) {
    // -- zome level errors -- //
    err(typeof zome === 'object', 'zome must be a json object')
    err(typeof zome.Name === 'string',
      '"Name" must be a string as a zome-level property')
    const zname = zome.Name || 'undefined'

    const zschemas = schemas[zname] || {}

    err(Array.isArray(zome.Functions),
      '"Functions" must be an array as a zome-level property', zname)
    err(Array.isArray(zome.Entries),
      '"Entries" must be an array as a zome-level property', zname)

    // -- zome level warnings -- //
    warn(typeof zome.Description === 'string',
      '"Description" should be a string as a zome-level property', zname)

    // -- entry checking -- //
    if (Array.isArray(zome.Entries)) {
      for (let entry of zome.Entries) {
        // -- entry level errors -- //
        err(typeof entry === 'object', 'entry must be a json object', zname)
        err(typeof entry.Name === 'string',
          '"Name" must be a string as an entry-level property', zname)
        const ename = zname + '.Entries.' + (entry.Name || 'undefined')

        const dtype = entry.DataFormat
        err(DATA_FORMATS.indexOf(dtype) >= 0,
          '"DataFormat" must be one of ' + JSON.stringify(DATA_FORMATS), ename)

        if (dtype === 'json') {
          err(typeof entry.SchemaFile === 'string',
            'given "DataFormat" === "json", "SchemaFile" must be a string as an entry-level property', ename)
          if (typeof entry.SchemaFile === 'string') {
            validateSchema(err, zschemas[entry.SchemaFile],
              zname, entry.SchemaFile)
          }
        }
      }
    }

    // -- function checking -- //
    if (Array.isArray(zome.Functions)) {
      for (let fn of zome.Functions) {
        // -- function level errors -- //
        err(typeof fn === 'object', 'function must be a json object', zname)
        err(typeof fn.Name === 'string',
          '"Name" must be a string as a function-level property', zname)
        const fname = zname + '.Functions.' + (fn.Name || 'undefined')

        const ctype = fn.CallingType
        err(ctype === 'json' || ctype === 'string',
          '"CallingType" must be either "json" or "string"', fname)

        // -- function level warnings -- //
        if (ctype === 'json') {
          warn(typeof fn.InputSchemaFile === 'string',
            'given "CallingType" === "json", "InputSchemaFile" should be a string as a function-level property', fname)
          if (typeof fn.InputSchemaFile === 'string') {
            validateSchema(warn, zschemas[fn.InputSchemaFile],
              zname, fn.InputSchemaFile)
          }
        }

        const rtype = fn.ReturnType
        warn(rtype === 'json' || rtype === 'string',
          '"ReturnType" should be either "json" or "string"', fname)

        if (rtype === 'json') {
          warn(typeof fn.OutputSchemaFile === 'string',
            'given "ReturnType" === "json", "OutputSchemaFile" should be a string as a function-level property', fname)
          if (typeof fn.OutputSchemaFile === 'string') {
            validateSchema(warn, zschemas[fn.OutputSchemaFile],
              zname, fn.OutputSchemaFile)
          }
        }
      }
    }
  }

  return out
}
