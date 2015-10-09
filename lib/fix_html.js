'use strict'

const cheerio = require('cheerio')
const hljs = require('highlight.js')

/**
 * Performs syntax highlighting and stuff.
 */

module.exports = function fixHtml (html) {
  const $ = cheerio.load(html)
  syntaxHighlight($)
  return $.html()
}

/**
 * Performs syntax highlighting via highlight.js. Given parameter `$` is a
 * cheerio object that it will modify in place.
 */

function syntaxHighlight ($) {
  $('pre > code[class]').each(function () {
    const $this = $(this)
    const langs = $this.attr('class').split(' ').filter((c) => /^lang-/.test(c))
    const lang = langs && langs[0].substr(5) // 'lang-js' => 'js'

    // Mappings of marked-to-github classes.
    const dict = {
      'hljs-string': 'pl-s',
      'hljs-comment': 'pl-c',
      'hljs-keyword': 'pl-k',
      'hljs-attribute': 'pl-e',
      'hljs-built_in': 'pl-c1',
      'hljs-title': 'pl-ent',
      'hljs-value': 'pl-s',
      'hljs-literal': 'pl-c1'
    }

    let html = $this.text()
    html = hljs.highlight(lang, html).value
    $this.html(html)

    $this.find('[class^="hljs-"]').each(function () {
      let $$this = $(this)
      var synonym = dict[$$this.attr('class')]
      if (synonym) $$this.attr('class', synonym)
    })
  })
}
