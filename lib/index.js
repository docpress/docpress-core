const ware = require('ware')
const each = require('lodash/collection/each')
const marked = require('marked')

const tocify = require('./tocify')
const indexify = require('./indexify')

module.exports = function (options) {
  var compile = ware()
    .use(buildIndex)
    .use(renderMarkdown)

  return compile.run.bind(compile)
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
  if (!files['docs/README.md']) {
    var err = new Error('No table of contents found')
    return done(err)
  }

  var toc = tocify(files['docs/README.md'].contents.toString())
  var index = indexify(toc)

  files['toc.json'] = { contents: JSON.stringify(toc, null, 2) + '\n' }
  files['index.json'] = { contents: JSON.stringify(index, null, 2) + '\n' }

  done()
}

/**
 * Converts .md to .html.
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
  var sources = Object.keys(files)
  var pages = JSON.parse(files['index.json'].contents)

  // 3: render each page
  each(pages, (opts, fname) => {
    const file = files[opts.source]
    file.markdown = file.contents
    file.html = marked(file.markdown.toString(), { gfm: true, tables: true })
    file.title = opts.title
    file.source = opts.source
    file.contents = file.html
    files[fname] = file
  })

  // delete sources
  sources.forEach((fname) => {
    if (fname !== 'toc.json' && fname !== 'index.json') {
      delete files[fname]
    }
  })

  done()
}
