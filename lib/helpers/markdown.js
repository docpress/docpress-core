'use strict'

const syntaxHighlight = require('../syntax_highlight')
const markdownIt = require('markdown-it')
const assign = Object.assign

var mdCache = {}

/**
 * Private: Returns a `markdown-it` instance with plugins loaded.
 *
 *     md({ typographer: true })
 *     md({ plugins: { decorate: {} } })
 */

module.exports = function md (options, cwd) {
  const plugins = (options && options.plugins) || []
  const key = JSON.stringify(options)
  if (mdCache[key]) return mdCache[key]

  let newOptions = {
    langPrefix: 'lang-',
    highlight: syntaxHighlight,
    linkify: true,
    html: true
  }

  newOptions = assign({}, newOptions, options || {}, { plugins: undefined })

  var md = markdownIt(newOptions)
  if (plugins) loadPlugins(md, plugins, cwd)

  mdCache[key] = md
  return md
}

function loadPlugins (md, plugins, cwd) {
  md = plugins.reduce((md, plug) => {
    if (plug instanceof Object && plug.name) {
      return md.use(require(plugPath(plug.name, cwd)), plug.options)
    }
    return md.use(require(plugPath(plug, cwd)))
  }, md)
}

function plugPath (plugName, cwd) {
  const pluginPath = tryRequire(`markdown-it-${plugName}`) ||
    (cwd && tryRequire(`${cwd}/node_modules/markdown-it-${plugName}`))
  if (!pluginPath) throw new Error(`Can't find module 'markdown-it-${plugName}'`)
  return pluginPath
}

function tryRequire (name) {
  try { return require.resolve(name) } catch (e) {}
}
