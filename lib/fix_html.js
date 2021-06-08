'use strict'
/* eslint-disable no-cond-assign */

const slugify = require('slugify')
const resolve = require('path').posix.resolve
const dirname = require('path').posix.dirname
const relative = require('path').posix.relative
const normalizePath = require('./helpers/normalize_path')

/**
 * Internal: Performs in-place HTML filters (such as fixing URLs).
 */

module.exports = function fixHtml ($, fname, sources, files, page) {
  idify($)
  fixReferences($, fname, sources, files, page)
}

/**
 * Private: Add IDs to headings.
 */

function idify ($) {
  $('h1, h2, h3, h4, h5, h6').each(function () {
    var $this = $(this)
    $this.attr('id', slugify($this.text()).toLowerCase())
  })
}

/**
 * Private: Fixes `<a href>` and `<img src>` references. Converts links to
 * Markdown files (eg, `/docs/usage.md`) into relative links to HTML files
 * (eg, `./usage.html`).
 */

function fixReferences ($, fname, sources, files, page) {
  var base = normalizePath(page.source)
  var m

  $('[href], [src]').each(function () {
    var $this = $(this)
    if ($this.attr('href')) fix($this, 'href')
    if ($this.attr('src')) fix($this, 'src')
  })

  function fix ($this, attr) {
    var origUrl = $this.attr(attr)
    var anchor = ''

    // Ignore http://, #anchor and mailto: links.
    if (origUrl.match(/^[a-z]+:\/\//) ||
      origUrl.match(/^mailto:/) ||
      origUrl.match(/^#/)) return

    if (m = origUrl.match(/^([^#]+)(#.*)$/)) {
      origUrl = m[1]
      anchor = m[2]
    }

    // Get the target source file it points to (eg, `docs/usage.md`).
    debugger
    var target = normalizePath(getTarget(origUrl, base))

    // Ensure that it's available.
    if (!sources[target]) {
      debugger
      console.log(sources)
      throw new Error(`${base}: Unknown reference '${origUrl}' (target: ${target})`)
    }

    // Relativize that absolute URL.
    target = relative('/' + dirname(sources[base]), '/' + sources[target]) + anchor
    $this.attr(attr, target)
  }
}

/*
 * Private: Transform `target` into an absolute URL (without `/`).
 *
 *     getTarget('/foo.md')               //=> 'foo.md'
 *     getTarget('foo.md', 'docs/x.md')   //=> 'docs/foo.md'
 */

function getTarget (url, base) {
  if (url.substr(0, 1) === '/') {
    return url.substr(1)
  } else {
    let resolved = resolve('/' + dirname(base) + '/' + url).substr(1)
    return resolved
  }
}
