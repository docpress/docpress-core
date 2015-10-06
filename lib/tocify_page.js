'use strict'

const marked = require('marked')

const slugify = require('slugify')

module.exports = function tocifyPage (md) {
  const tokens = marked.lexer(md.toString())
  const re = []

  tokens.forEach((token) => {
    if (token.type === 'heading' && [2, 3].indexOf(token.depth) > -1) {
      re.push({
        title: token.text,
        depth: token.depth,
        id: slugify(token.text).toLowerCase()
      })
    }
  })

  if (re.length) return re
}
