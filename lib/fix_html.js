'use strict'

const slugify = require('slugify')
const resolve = require('path').resolve
const dirname = require('path').dirname
const relative = require('path').relative

/**
 * Performs syntax highlighting and stuff.
 */

module.exports = function fixHtml ($, fname, sources, files, page) {
  idify($)
  fixReferences($, fname, sources, files, page)
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

function fixReferences ($, fname, sources, files, page) {
  var base = page.source

  $('[href], [src]').each(function () {
    var $this = $(this)
    if ($this.attr('href')) fix($this, 'href')
    if ($this.attr('src')) fix($this, 'src')
  })

  function fix ($this, attr) {
    var origUrl = $this.attr(attr)

    // Ignore http:// and #anchor links.
    if (origUrl.match(/^[a-z]+:\/\//) || origUrl.match(/^#/)) return

    // Get the target source file it points to (eg, `docs/usage.md`).
    var target = getTarget(origUrl, base)

    // Ensure that it's available.
    if (!sources[target] && !files[target]) {
      throw new Error(`${fname}: Unknown reference '${origUrl}'`)
    }

    // Relativize that absolute URL.
    target = relative('/' + dirname(sources[base]), '/' + sources[target])
    $this.attr(attr, target)
  }
}

/*
 * Transform `target` into an absolute URL (without `/`).
 *
 *     getTarget('/foo.md')               //=> 'foo.md'
 *     getTarget('foo.md', 'docs/x.md')   //=> 'docs/foo.md'
 */

function getTarget (url, base) {
  if (url.substr(0, 1) === '/') {
    return url.substr(1)
  } else {
    return resolve('/' + dirname(base) + '/' + url).substr(1)
  }
}
