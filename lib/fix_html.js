'use strict'

const cheerio = require('cheerio')
const slugify = require('slugify')

/**
 * Performs syntax highlighting and stuff.
 */

module.exports = function fixHtml (html) {
  const $ = cheerio.load(html)
  idify($)
  return $.html()
}

/**
 * Add ids
 */

function idify ($) {
  $('h1, h2, h3, h4, h5, h6').each(function () {
    var $this = $(this)
    $this.attr('id', slugify($this.text()).toLowerCase())
  })
}
