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
    expect(fx.exists('_docpress/index.html')).toEqual(true)
    expect(fx.exists('_docpress/index.json')).toEqual(true)
    expect(fx.exists('_docpress/toc.json')).toEqual(true)
    expect(fx.exists('_docpress/testing.html')).toEqual(true)
    expect(fx.exists('_docpress/cleanup.html')).toEqual(true)
  })

  it('renders htmls', function () {
    expect(fx.read('_docpress/index.html').toLowerCase())
      .toInclude('</h1>')
    expect(fx.read('_docpress/testing.html').toLowerCase())
      .toInclude('</h1>')
  })

  it('leaves assets alone', function () {
    expect(fx.exists('_docpress/assets/style.css')).toEqual(true)
    expect(fx.exists('_docpress/image.png')).toEqual(true)
  })

  it('deletes unused files', function () {
    expect(fx.exists('_docpress/README.md')).toEqual(false)
  })

  describe('toc.json', function () {
    before(function () {
      data = fx.read('_docpress/toc.json')
      data = JSON.parse(data)
    })

    it('renders proper json', function () { })

    it('has headings', function () {
      expect(data.sections[0].headings.length).toBeGreaterThan(2)
    })
  })

  describe('index.json', function () {
    before(function () {
      data = fx.read('_docpress/index.json')
      data = JSON.parse(data)
    })

    it('renders proper json', function () { })
  })
})
