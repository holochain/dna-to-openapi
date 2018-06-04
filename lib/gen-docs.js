'use strict'

const fs = require('fs')
const path = require('path')

const sui = require('swagger-ui-dist')

exports.genDocs = function genDocs (openapi) {
  const distPath = sui.getAbsoluteFSPath()

  let out = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Swagger UI</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Source+Code+Pro:300,600|Titillium+Web:400,600,700" rel="stylesheet">
    <style type="text/css">
`

  const addResource = function addResource (resourcePath) {
    out += '\n'
    out += fs.readFileSync(path.join(distPath, resourcePath))
    out += '\n'
  }

  addResource('swagger-ui.css')

  out += `
      html
      {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }

      *,
      *:before,
      *:after
      {
        box-sizing: inherit;
      }

      body
      {
        margin:0;
        background: #fafafa;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script>
`

  addResource('swagger-ui-bundle.js')
  addResource('swagger-ui-standalone-preset.js')

  out += `
      window.onload = function() {
        const spec = `

  out += openapi

  out += `
        // Build a system
        const ui = SwaggerUIBundle({
          spec: spec,
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
          ],
          layout: "StandaloneLayout"
        })

        window.ui = ui
      }
    </script>
  </body>
</html>
`

  return out
}
