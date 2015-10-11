'use strict'
/* eslint-disable no-cond-assign */

const marked = require('marked')
const normalize = require('path').normalize
const stripMarkdown = require('./helpers/strip_markdown')

const slugify = require('./slugify')
const tocifyPage = require('./tocify_page')

module.exports = function tocify (md, files, options) {
  var tokens = marked.lexer(md)

  var re = { sections: [] }
  var crumbs = [scope]
  var current = re
  var docs = options && options.docs || 'docs'
  var scope

  tokens.forEach((token) => {
    switch (token.type) {
      case 'list_start':
        scope = current.sections = []
        crumbs.push(scope)
        break

      case 'text':
        current = itemify(token.text, docs, files)
        scope.push(current)
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

function itemify (text, docs, files) {
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
    url = source.replace(/\.md$/, '.html')
    url = url.replace(/README\.html$/, 'index.html')
    url = url.replace(docsExpr, '')
  }

  current.title = title
  if (source) current.source = source

  // Add slug
  if (url) {
    current.url = url
    current.slug = slugify(url) || 'index'
  }

  // Add headings
  if (source && files && files[source]) {
    const headings = tocifyPage(files[source].contents)
    if (headings) current.headings = headings
  }

  return current
}
