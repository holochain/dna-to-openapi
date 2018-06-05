# dna-to-openapi

given holochain dna, generate a swagger / openapi spec file / static swagger-ui html documentation

## usage

### commandline

`$` `npm install -g @holochain/dna-to-openapi`

`$` `dna-to-openapi -h`

```
Usage dna-to-openapi [options]

Options:
  -p, --path     specify a path (otherwise ".")
  -s, --spec     generates an open-api spec file ("-" for stdout)
  -d, --doc      generates a static swagger-ui html doc ("-" for stdout)
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

Examples:
  dna-to-openapi                            lints the given holo app / dna
  dna-to-openapi --path <path>              to specify a path (otherwise ".")
  dna-to-openapi --spec <spec-file.json>    generates an open-api spec
  dna-to-openapi --doc <api-doc.html>       generates static swagger-ui html doc
  dna-to-openapi --spec <spec-file.json>    does both
  --doc <api-doc.html>
```

### as a library

```javascript
const dna = require('dna-to-openapi')

// 1 - lint
const lintResults = dna.lint(dnaJsonObject, schemasObject)

// if there are errors (lintResults.errors), abort here.
// generating a spec file with lint errors may not work
if (lintResults.errors.length > 0) {
  process.exit(1)
}

// 2 - generate openapi spec
const specJson = dna.convert(dnaJsonObject, schemasObject)

// 3 - generate swagger-ui html
const swaggerHtml = dna.genDocs(specJson)
```
