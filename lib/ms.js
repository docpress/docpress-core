'use strict'
/* eslint-disable no-cond-assign */

const Metalsmith = require('metalsmith')
const join = require('path').join
const log = require('./log')
const assign = Object.assign

/**
 * Returns a metalsmith object.
 */

function docpress (cwd, options) {
  let meta = { docs: 'docs' }
  assign(meta, loadConfig(cwd, meta.docs))

  let app = Metalsmith(cwd)
    .source('.')
    .destination('_docpress')
    .metadata(meta)
    .ignore(`!**/{${meta.docs}{,/**/*},*.md}`)

  return app
}

/**
 * Internal: loads configuration and returns it as an object.
 */

function loadConfig (cwd, docs) {
  let fn
  if (exists(fn = join(cwd, 'docpress.json'))) {
    log(`Using config: ${fn}`)
    return require(fn)
  }

  if (exists(fn = join(cwd, docs, 'docpress.json'))) {
    log(`Using config: ${fn}`)
    return require(fn)
  }

  if (exists(fn = join(cwd, 'package.json'))) {
    var pkg = require(fn)
    if (pkg && pkg.docpress) {
      log(`Using config: ${fn} (.docpress)`)
      return pkg.docpress
    }
  }
}

function exists (file) {
  try {
    require('fs').statSync(file)
    return true
  } catch (e) {}
}

module.exports = docpress
