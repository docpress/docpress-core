'use strict'

const cheerio = require('cheerio')
const slugify = require('slugify')
const resolve = require('path').resolve
const dirname = require('path').dirname

/**
 * Performs syntax highlighting and stuff.
 */

module.exports = function fixHtml (html, fname, sources) {
  const $ = cheerio.load(html)
  idify($)
  fixReferences($, fname, sources)
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

function fixReferences ($, fname, sources) {
  var base = dirname(fname)

  $('[href], [src]').each(function () {
    var $this = $(this)
    if ($this.attr('href')) fix($this, 'href')
    if ($this.attr('src')) fix($this, 'src')
  })

  function fix ($this, attr) {
    var origUrl = $this.attr(attr)
    var url = origUrl

    // Ignore http:// urls
    if (url.match(/^[a-z]+:\/\//)) return

    if (url.substr(0, 1) === '/') {
      url = url.substr(1)
    } else {
      url = resolve('/' + base + '/' + url)
      url = url.substr(1) // strip '/'
    }

    if (!sources[url]) {
      throw new Error(`${fname}: Unknown reference '${origUrl}'`)
    }

    url = sources[url]
    $this.attr(attr, url)
  }
}
