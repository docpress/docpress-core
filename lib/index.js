'use strict'

const Metalsmith = require('metalsmith')
const base0 = require('./base0')

/**
 * Returns a metalsmith object.
 */

function bookdown (cwd) {
  return Metalsmith(cwd)
    .source('.')
    .destination('_bookdown')
    .ignore('!{*.md,docs}') // only include /docs/ and /*.md
    .ignore('_bookdown') // ignore output
    .ignore('_book')
    .use(base0)
}

module.exports = bookdown
