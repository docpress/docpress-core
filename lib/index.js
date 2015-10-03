'use strict'

const Metalsmith = require('metalsmith')
const compile = require('./compile')

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
    .use(compile)
}

module.exports = bookdown
