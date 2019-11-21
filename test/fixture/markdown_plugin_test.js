'use strict'

const fixture = require('../support/fixture')

describe('fixture/markdown plugin:', function () {
  describe('array config:', function () {
    let app

    const fx = fixture('markdown-plugin-array-config')

    before(function (done) {
      app = require(fx.path('metalsmith.js'))
      app.build((err, files) => {
        this.files = files
        if (err) return done(err)
        done()
      })
    })

    it('outputs the right files', function () {
      expect(fx.exists('_docpress/index.html')).toEqual(true)
    })

    it('makes markdown-it-decorate work', function () {
      expect(fx.read('_docpress/index.html'))
        .toContain('<h1 class="hello" id="my-project">')
    })
  })

  describe('object config:', function () {
    let app

    const fx = fixture('markdown-plugin-object-config')

    before(function (done) {
      app = require(fx.path('metalsmith.js'))
      app.build((err, files) => {
        this.files = files
        if (err) return done(err)
        done()
      })
    })

    it('outputs the right files', function () {
      expect(fx.exists('_docpress/index.html')).toEqual(true)
    })

    it('makes markdown-it-decorate work', function () {
      expect(fx.read('_docpress/index.html'))
        .toContain('<h1 class="hello" id="my-project">')
    })
  })
})
