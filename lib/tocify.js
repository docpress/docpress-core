var marked = require('marked')
var slugify = require('slugify')

module.exports = function tocify (md) {
  var tokens = marked.lexer(md)

  var re = { sections: {} }
  var crumbs = [scope]
  var current = re
  var scope

  tokens.forEach((token) => {
    switch (token.type) {
      case 'list_start':
        scope = current.sections = {}
        crumbs.push(scope)
        break

      case 'text':
        const m = token.text.match(/^\[([^\]]*)\]\((.*)\)$/)
        const title = m ? m[1] : token.text
        const source = m ? m[2] : null
        const key = slugify(title).toLowerCase()

        current = scope[key] = { title: title }
        if (source) current.source = source
        break

      case 'list_end':
        crumbs.pop()
        scope = crumbs[crumbs.length - 1]
        break
    }
  })

  return re
}
