'use strict'

const Metalsmith = require('metalsmith')
const each = require('lodash/collection/each')
const marked = require('marked')

const tocify = require('./tocify')

function bookdown (cwd) {
  return Metalsmith(cwd)
    .source('.')
    .destination('_bookdown')
    .ignore('**/*.!(md)') // ignore non-md files
    .ignore('.*') // ignore dot directories
    .ignore('node_modules')
    .ignore('_bookdown') // ignore output
    .ignore('_book')
    .use(tocifyMd)
    .use(bookdownParse)
}

function tocifyMd (files, ms, done) {
  if (!files['docs/README.md']) {
    var err = new Error('No table of contents found')
    return done(err)
  }

  var toc = tocify(files['docs/README.md'].contents.toString())

  // 1: find or infer the TOC.
  //    - strip out docs/ prefix
  //    - turn the first page in the toc to `index.html`
  //    - turn README to index
  //    - flatten it as `pages`
  files['toc.json'] = {
    contents: JSON.stringify(toc, null, 2) + '\n'
  }

  done()
}

function bookdownParse (files, ms, done) {
  var sources = Object.keys(files)
  console.log(sources)

  // 2: flatten TOC to pages.
  var pages = {
    'index.html': { source: 'README.md' },
    'rails.html': { source: 'docs/rails.md' }
  }

  files['pages.json'] = {
    contents: JSON.stringify(pages) + '\n'
  }

  // 3: render each page
  each(pages, (opts, fname) => {
    const file = files[opts.source]
    file.markdown = file.contents
    file.contents = marked(file.contents.toString(), { gfm: true, tables: true })
    files[fname] = file
  })

  // 4: add assets

  // delete sources
  sources.forEach((fname) => {
    if (fname !== 'toc.json') {
      delete files[fname]
    }
  })

  done()
}

module.exports = bookdown
