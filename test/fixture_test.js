'use strict'

const fixture = require('./support/fixture')

describe('fixture', function () {
  let app, data

  let fx = fixture('onmount')

  before(function (done) {
    app = require(fx.path('metalsmith.js'))
    app.build((err) => {
      if (err) return done(err)
      done()
    })
  })

  it('outputs the right files', function () {
    expect(fx.exists('_bookdown/index.html')).toEqual(true)
    expect(fx.exists('_bookdown/index.json')).toEqual(true)
    expect(fx.exists('_bookdown/toc.json')).toEqual(true)
    expect(fx.exists('_bookdown/testing.html')).toEqual(true)
    expect(fx.exists('_bookdown/cleanup.html')).toEqual(true)
  })

  it('renders htmls', function () {
    expect(fx.read('_bookdown/index.html').toLowerCase())
      .toInclude('</h1>')
    expect(fx.read('_bookdown/testing.html').toLowerCase())
      .toInclude('</h1>')
  })

  it('leaves assets alone', function () {
    expect(fx.exists('_bookdown/assets/style.css')).toEqual(true)
    expect(fx.exists('_bookdown/image.png')).toEqual(true)
  })

  it('deletes unused files', function () {
    expect(fx.exists('_bookdown/README.md')).toEqual(false)
  })

  describe('toc.json', function () {
    before(function () {
      data = fx.read('_bookdown/toc.json')
    })

    it('renders', function () {
      expect(data.length).toBeGreaterThan(1)
      JSON.parse(data)
    })
  })

  describe('index.json', function () {
    before(function () {
      data = fx.read('_bookdown/index.json')
    })

    it('renders', function () {
      expect(data.length).toBeGreaterThan(1)
      JSON.parse(data)
    })
  })
})
