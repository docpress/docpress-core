const ware = require('ware')
const each = require('lodash/collection/each')
const marked = require('marked')

const tocify = require('./tocify')
const indexify = require('./indexify')

module.exports = function (options) {
  var app = ware()
    .use(buildIndex)
    .use(renderMarkdown)
    .use(cleanFiles)

  return function (files, ms, done) {
    app.run(files, ms, done)
  }
}

/**
 * Builds toc.json and index.json.
 *
 * Each toc item has:
 *
 * - `sections` (key/value of sections)
 * - `source` (path to source)
 * - `title` (title)
 * - `url` (URL, if applicable)
 *
 * Each index item has:
 *
 * - `source`
 * - `title`
 */

function buildIndex (files, ms, done) {
  var docs = ms.metadata().docs || 'docs'

  if (!files[`${docs}/README.md`]) {
    var err = new Error(`Table of contents ('${docs}/README.md'}') found`)
    return done(err)
  }

  var toc = tocify(files[`${docs}/README.md`].contents.toString(), { docs })
  var index = indexify(toc, { docs })
  // TODO: validate all files referenced exist

  files['toc.json'] = { contents: JSON.stringify(toc, null, 2) + '\n' }
  files['index.json'] = { contents: JSON.stringify(index, null, 2) + '\n' }

  done()
}

/**
 * Private: Converts .md to .html.
 *
 * At the end of this, you get a site with `.html` files (bare, no layout)
 * and a `toc.json` and `index.json`.
 *
 * Each html also has:
 *
 * - `title` (title according to TOC)
 * - `source` (path of source)
 * - `markdown` (raw Markdown source)
 * - `html` (rendered HTML)
 */

function renderMarkdown (files, ms, done) {
  var pages = JSON.parse(files['index.json'].contents)

  // render each page
  each(pages, (page, fname) => {
    const file = files[page.source]
    file._processed = true
    file.markdown = file.contents
    file.html = marked(file.markdown.toString(), { gfm: true, tables: true })
    file.title = page.title
    file.source = page.source
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
  const docs = ms.metadata().docs || 'docs'
  const docsExpr = new RegExp('^' + docs + '/')

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
    const newName = fname.replace(docsExpr, '')
    if (newName !== fname) {
      files[newName] = files[fname]
      delete files[fname]
    }
  })

  done()
}
