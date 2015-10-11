'use strict'

const ware = require('ware')
const each = require('lodash/collection/each')
const markdownIt = require('markdown-it')
const cheerio = require('cheerio')

const tocify = require('./tocify')
const indexify = require('./indexify')
const fixHtml = require('./fix_html')
const syntaxHighlight = require('./syntax_highlight')

const assign = Object.assign

/**
 * Metalsmith Middleware that takes a source tree and generates a site from it.
 * It turns markdown into HTML files, but these files are bare and don't have
 * anything other than rendered markup.
 *
 * It also builds _docpress.json which has reusable
 * metadata for subsequent tools (like `docpress-base`).
 *
 * ### _docpress.json
 * `_docpress.json` is a JSON file with the following metadata:
 *
 * - `index` (Object) — pages index.
 * - `toc` (Object) — table of contents (as a tree).
 * — `sources` (Object) — a mapping of source to destination filenames.
 *
 * These datas can be obtained via `files['_docpress.json'].index` (ie, as
 * Metalsmith file metadata) or by parsing _docpress.json.
 *
 *     files['_docpress.json'].index
 *     files['_docpress.json'].sources
 *     files['_docpress.json'].toc
 *
 * ### Index
 * Each `index` item has:
 *
 * - `source` — path to source
 * - `title` — the page title according to TOC
 * - `slug` — slug for the page
 * - `headings` — an array of headings
 *
 *     index = files['_docpress.json'].index
 *     index['index.html']
 *     => {
 *       source: 'README.md',
 *       title: 'My project',
 *       slug: 'index',
 *       headings: [
 *         { title: 'Overview', depth: 2, id: 'overview' },
 *         { title: 'Usage', depth: 2, id: 'usage', headings: [
 *           { title: 'via npm', depth: 3, id: 'via-npm' },
 *         ]},
 *       ]
 *     }
 *
 * ### Sources
 * `sources` is a key-value pairing of source files to built files.
 *
 *     files['_docpress.json'].sources
 *     => {
 *       "README.md": "index.html",
 *       "docs/usage.md": "usage.html",
 *       "docs/install/windows.md": "install/windows.html"
 *     }
 *
 * ### Table of contents
 * Each `toc` item has:
 *
 * - `sections` — array of sections
 * - `source` — path to source
 * - `title` — title
 * - `slug` — slug for the item
 * - `url` — URL, if applicable
 * - `headings` — array of `{ title, depth, id }`
 * - `anchor` — anchor to the TOC link, if any
 *
 *     toc = files['_docpress.json'].toc
 *     toc = {
 *       sections: [
 *         {
 *           title: 'My project',
 *           source: 'README.md',
 *           url: 'index.html',
 *           slug: 'index',
 *           headings: [ ... ]
 *         }, ...
 *       ]
 *     }
 *
 * ### Each file
 * Each HTML file will have these metadata available:
 *
 *     file = files['index.html']
 *     file._processed  //=> true
 *     file.title       //=> "My project"
 *     file.slug        //=> "index" (perfect for HTML IDs)
 *     file.source      //=> "README.md" (where it was rendered from)
 *     file.filename    //=> "index.html" (new filename)
 *     file.$           // Cheerio instance
 *     file.markdown    // Markdown source
 *     file.html        // Rendered HTML
 *     file.contents    // Same as `.html`
 */

module.exports = function core (options) {
  var app = ware()
    .use(buildIndex)
    .use(renderMarkdown)
    .use(cleanFiles)

  return function (files, ms, done) {
    app.run(files, ms, done)
  }
}

/**
 * Private: builds `_docpress.json`. See `core()` for a description on what it
 * is.  It will also modify files with the `.filenmae` attribute.
 */

function buildIndex (files, ms, done) {
  const docs = ms.metadata().docs || 'docs'
  const docsExpr = new RegExp('^' + docs + '/')

  const readme = findMatch(files, new RegExp(`^${docs}/README.md$`, 'i'))

  if (!readme || !files[readme]) {
    var err = new Error(`Table of contents not found ('${docs}/README.md')`)
    return done(err)
  }

  // Build `toc`
  var toc = tocify(files[readme].contents.toString(), files, { docs })

  // Build `index` and `sources`
  var indexes = indexify(toc, { docs })

  // Generate source mappings for things outside the TOC
  Object.keys(files).forEach((fname) => {
    const file = files[fname]
    if (!indexes.sources[fname]) {
      // rename images
      const filename = fname.replace(docsExpr, '')
      if (filename !== fname && !fname.match(/\.md$/)) {
        file.filename = filename
        indexes.sources[fname] = filename
      }
    } else {
      file.filename = indexes.sources[fname]
    }
  })

  // Ensure every link in the TOC works
  verifyIndex(indexes.index, files)

  var data = {
    toc: toc,
    index: indexes.index,
    sources: indexes.sources
  }

  // Save
  files['_docpress.json'] = assign({}, data, {
    contents: JSON.stringify(data, null, 2) + '\n'
  })

  done()
}

/**
 * Private: Converts .md to .html.
 * At the end of this, you get a site with `.html` files (bare, no layout).
 */

function renderMarkdown (files, ms, done) {
  var pages = files['_docpress.json'].index
  var sources = files['_docpress.json'].sources

  // render each page
  each(pages, (page, fname) => {
    const file = files[page.source]
    const html = markdownIt({
      langPrefix: 'lang-',
      highlight: syntaxHighlight,
      linkify: true,
      html: true
    }).render(file.contents.toString())
    const $ = cheerio.load(html)

    fixHtml($, fname, sources, files, page)
    file.$ = $
    file._processed = true
    file.markdown = file.contents
    file.html = $.html()
    file.title = page.title
    file.source = page.source
    file.slug = page.slug
    file.contents = file.html
    files[fname] = file
    delete files[page.source]
  })

  done()
}

/**
 * Private: Cleans unused md's.
 */

function cleanFiles (files, ms, done) {
  // rename any old files
  each(files, (file, fname) => {
    // leave those that was processed
    if (file._processed) return

    // ignore unused .md's (such as docs/README.md)
    if (fname.match(/\.md$/)) {
      delete files[fname]
      return
    }

    // rename docs/images/pic.png => images/pic.png
    // (`filename` is left by an earlier step)
    if (file.filename) {
      files[file.filename] = files[fname]
      delete files[fname]
    }
  })

  done()
}

/**
 * Private: validate that pages in `index` are present in `files`. Throw an
 * error if something's missing.
 */

function verifyIndex (index, files) {
  each(index, (file, url) => {
    if (!files[file.source]) {
      throw new Error(`Invalid reference '${file.source}'`)
    }
  })
}

/**
 * Private: finds the file in `file` that matches a given regexp `expr`.
 *
 *     findMatch(files, /\/README.md$/i)
 */

function findMatch (files, expr) {
  const filenames = Object.keys(files)
  return filenames.find((f) => f.match(expr))
}
