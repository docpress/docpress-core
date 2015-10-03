'use strict'

var marked = require('marked')

module.exports = function tocify (md) {
  var tokens = marked.lexer(md)

  var re = { sections: {} }
  var crumbs = [scope]
  var current = re
  var scope

  tokens.forEach((token) => {
    switch (token.type) {
      case 'list_start':
        scope = current.sections = []
        crumbs.push(scope)
        break

      case 'text':
        const m = token.text.match(/^\[([^\]]*)\]\((.*)\)$/)
        const title = m ? m[1] : token.text
        let source = m ? m[2] : null
        let url

        if (source && source.substr(0, 1) !== '/') {
          throw new Error('source not valid: ' + url)
        }

        if (source) {
          source = source.replace(/^\//, '')
          url = source.replace(/\.md$/, '.html')
          url = url.replace(/README\.html$/, 'index.html')
          // url = url.replace(/\/docs\//, '/')
        }

        current = { title }
        if (source) current.source = source
        if (url) current.url = url
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
