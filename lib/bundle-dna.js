'use strict'

const fs = require('fs')
const path = require('path')

/**
 * Helper, checks if path is a file
 * @private
 */
function _isFile (path) {
  try {
    const stat = fs.statSync(path)
    return stat.isFile()
  } catch (e) {
    return false
  }
}

/**
 * Helper, checkdown looking for dna.json file
 * Parses it if found
 * @private
 */
function _findDna (origin) {
  origin || (origin = '.')
  origin = path.resolve(origin)

  const checkdown = [
    path.join(origin, 'dna'),
    origin
  ]

  for (let check of checkdown) {
    const dnaFile = path.join(check, 'dna.json')
    if (_isFile(dnaFile)) {
      return {
        dnaDir: check,
        dna: JSON.parse(fs.readFileSync(dnaFile))
      }
    }
  }

  throw new Error('could not find dna file, starting from "' + origin + '"')
}

/**
 * As resiliently as possible, load dna and schemas
 */
exports.bundleDna = function bundleDna (appDir) {
  const dna = _findDna(appDir)

  const schemas = {}

  const fetchSchema = function fetchSchema (zome, schema) {
    if (!(zome in schemas)) {
      schemas[zome] = {}
    }
    const zomeDef = schemas[zome]
    if (schema in zomeDef) {
      // already loaded
      return
    }
    zomeDef[schema] = JSON.parse(fs.readFileSync(path.join(
      dna.dnaDir, zome, schema)))
  }

  for (let zome of dna.dna.Zomes) {
    for (let entry of zome.Entries) {
      if (!('SchemaFile' in entry)) {
        continue
      }
      fetchSchema(zome.Name, entry.SchemaFile)
    }
    for (let fn of zome.Functions) {
      if ('InputSchemaFile' in fn) {
        fetchSchema(zome.Name, fn.InputSchemaFile)
      }
      if ('OutputSchemaFile' in fn) {
        fetchSchema(zome.Name, fn.OutputSchemaFile)
      }
    }
  }

  return {
    dna: dna.dna,
    schemas: schemas
  }
}
