module.exports = function indexify (toc) {
  const re = {}
  walk(toc)
  return re

  function walk (item) {
    if (item.url) {
      re[item.url] = { source: item.source }
    }

    if (item.sections) {
      item.sections.forEach((s) => walk(s))
    }
  }
}
