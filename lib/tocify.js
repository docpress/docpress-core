'use strict'
/* eslint-disable no-cond-assign */

const marked = require('marked')
const normalize = require('path').normalize
const stripMarkdown = require('./helpers/strip_markdown')

const slugify = require('./slugify')
const tocifyPage = require('./tocify_page')

/**
 * Internal: builds TOC.
 *
 * It is also responsible for renaming `.md` files
 */

module.exports = function tocify (md, files, options) {
  var tokens = marked.lexer(md)

  var re = { sections: [] }
  var crumbs = [scope]
  var current = re
  var docs = options && options.docs || 'docs'
  var scope
  var urls = {}
  var slugs = {}
  var i = 0

  tokens.forEach((token) => {
    switch (token.type) {
      case 'list_start':
        scope = current.sections = []
        crumbs.push(scope)
        break

      case 'text':
        current = itemify(token.text, docs, files, urls, slugs, i++)
        scope.push(current)
        urls[current.url] = current
        slugs[current.slug] = current
        break

      case 'list_end':
        crumbs.pop()
        scope = crumbs[crumbs.length - 1]
        break
    }
  })

  return re
}

/**
 * Internal: turns a token text (like `[README](../README.md)`) into an item in
 * the table of contents. Used by `tocify()`.
 *
 * Sets:
 *
 * - `title`
 * - `source`
 * - `expand`
 * - `anchor`
 */

function itemify (text, docs, files, urls, slugs, i) {
  const docsExpr = new RegExp('^' + docs + '/')
  const current = {}

  // Parse things
  let m, title, source
  if (m = text.match(/^\[([^\]]*)\]\((.*)\)$/)) {
    title = stripMarkdown(m[1])
    source = m[2]
  } else if (m = text.match(/^(?:__|\*\*)\[([^\]]*)\]\((.*)\)(?:__|\*\*)$/)) {
    title = stripMarkdown(m[1])
    source = m[2]
    current.expand = true
  } else {
    title = stripMarkdown(text)
  }

  let url

  if (source) {
    if (m = source.match(/^([^#]*)(#.*)$/)) {
      source = m[1]
      current.anchor = m[2]
    }
    if (source.substr(0, 1) !== '/') source = normalize(docs + '/' + source)
    source = source.replace(/^\//, '')

    if (i === 0) {
      url = 'index.html'
    } else {
      url = source.replace(/\.md$/, '.html')
      url = url.replace(/README\.html$/, 'index.html')
      url = url.replace(docsExpr, '')
    }
    url = declash(url, urls)
  }

  current.title = title
  if (source) current.source = source

  // Add slug
  if (url) {
    current.url = url
    let slug = slugify(url) || 'index'
    current.slug = declash(slug, slugs, { extension: false })
  }

  // Add headings
  if (source && files && files[source]) {
    const headings = tocifyPage(files[source].contents)
    if (headings) current.headings = headings
  }

  return current
}

/**
 * Internal: return a URL based from `baseUrl` that isn't in URLs.
 *
 *     declash('hi.html', { 'index.html': 1 }) //=> 'hi.html'
 *     declash('index.html', { 'index.html': 1 }) //=> 'index-2.html'
 */

function declash (baseUrl, urls, options) {
  if (!urls[baseUrl]) return baseUrl

  let m, basename, ext, i, url

  if (!options || options.extension) {
    m = baseUrl.match(/^(.*)(\.[^.]*)$/)
    basename = m[1]
    ext = m[2]
  } else {
    basename = baseUrl
    ext = ''
  }

  for (i = 2, url = baseUrl; urls[url]; i++) {
    url = `${basename}-${i++}${ext}`
  }

  return url
}
