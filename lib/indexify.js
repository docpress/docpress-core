/**
 * Turns a TOC into an index.
 *
 *     {
 *       'docs/index.html': { source: 'docs/README.md' }
 *     }
 */

module.exports = function indexify (toc) {
  const index = {}
  const sources = {}
  walk(toc)
  return { index, sources }

  function walk (item) {
    if (item.url) {
      sources[item.source] = item.url
      index[item.url] = {
        source: item.source,
        title: item.title,
        slug: item.slug
      }

      if (item.headings) index[item.url].headings = item.headings
    }

    if (item.sections) {
      item.sections.forEach((s) => walk(s))
    }
  }
}
