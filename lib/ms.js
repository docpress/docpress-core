'use strict'

const Metalsmith = require('metalsmith')
const join = require('path').join

/**
 * Returns a metalsmith object.
 */

function docpress (cwd, options) {
  var docs = 'docs'
  let app = Metalsmith(cwd)
    .source('.')
    .destination('_docpress')
    .metadata({ docs })
    .ignore(`!**/{${docs}{,/**/*},*.md}`)

  if (exists(join(cwd, docs, 'docpress.json'))) {
    app.metadata(require(join(cwd, docs, 'docpress.json')))
  }

  return app
}

function exists (file) {
  try {
    require('fs').statSync(file)
    return true
  } catch (e) {}
}

module.exports = docpress
