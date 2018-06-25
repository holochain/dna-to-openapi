'use strict'

const sui = require('./gen/swagger-resources')

exports.genDocs = function genDocs (openapi) {
  let out = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Swagger UI</title>
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Source+Code+Pro:300,600|Titillium+Web:400,600,700" rel="stylesheet">
    <style type="text/css">
`

  out += '\n' + sui.uiCss + '\n'

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

  out += '\n' + sui.uiBundle + '\n'
  out += '\n' + sui.uiStandalonePreset + '\n'

  out += `
      window.onload = function() {
        const spec = `

  out += JSON.stringify(openapi, null, '  ')

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
