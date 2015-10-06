'use strict'

const parameterize = require('slugify')

/**
 * Turns a string into a normalized string that can be used for a CSS
 * id/classname.
 *
 *     slugify('/foo/bar.html')
 *     //=> 'foo-bar'
 */

module.exports = function slugify (str) {
  str = str.replace(/\/index.html$/, '')
  str = str.replace(/.html$/, '')
  str = parameterize(str)
  if (str.length) return str
}
