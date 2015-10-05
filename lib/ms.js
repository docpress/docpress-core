'use strict'

const Metalsmith = require('metalsmith')

/**
 * Returns a metalsmith object.
 */

function docpress (cwd, options) {
  return Metalsmith(cwd)
    .source('.')
    .destination('_docpress')
    .metadata({ docs: 'docs' })
    .ignore('!**/{docs{,/**/*},*.md}')
}

module.exports = docpress
