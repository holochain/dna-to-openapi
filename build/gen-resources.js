#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const sui = require('swagger-ui-dist')
const distPath = sui.getAbsoluteFSPath()

function _fetchResource (rPath) {
  return fs.readFileSync(path.join(distPath, rPath)).toString()
}

const out = {
  uiCss: _fetchResource('swagger-ui.css'),
  uiBundle: _fetchResource('swagger-ui-bundle.js'),
  uiStandalonePreset: _fetchResource('swagger-ui-standalone-preset.js')
}

fs.writeFileSync(
  path.join(__dirname, '..', 'lib', 'gen', 'swagger-resources.json'),
  JSON.stringify(out, null, '  '))
