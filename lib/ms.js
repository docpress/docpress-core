'use strict'

const Metalsmith = require('metalsmith')

/**
 * Returns a metalsmith object.
 */

function bookdown (cwd, options) {
  return Metalsmith(cwd)
    .source('.')
    .destination('_bookdown')
    .ignore('!**/{docs{,/**/*},*.md}')
}

module.exports = bookdown
