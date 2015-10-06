/**
 * Turns a TOC into an index.
 *
 *     {
 *       'docs/index.html': { source: 'docs/README.md' }
 *     }
 */

module.exports = function indexify (toc) {
  const re = {}
  walk(toc)
  return re

  function walk (item) {
    if (item.url) {
      re[item.url] = {
        source: item.source,
        title: item.title,
        slug: item.slug
      }

      if (item.headings) re[item.url].headings = item.headings
    }

    if (item.sections) {
      item.sections.forEach((s) => walk(s))
    }
  }
}
