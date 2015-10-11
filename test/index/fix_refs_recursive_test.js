const compile = require('../../index')()

describe('index/fix refs recursive:', function () {
  beforeEach(function (done) {
    // Mock metalsmith object
    var ms = {
      metadata () {
        return { docs: 'docs' }
      }
    }

    this.files = {
      'docs/README.md': {
        contents:
          '* [Introduction](/docs/introduction.md)\n' +
          '* [Getting started](/docs/getting-started.md)\n'
      },
      'docs/getting-started.md': {
        contents: 'hi'
      },
      'docs/introduction.md': {
        contents: '[getting started](getting-started.md)'
      }
    }

    compile(this.files, ms, (err) => {
      if (err) throw err
      done()
    })
  })

  it('works', function () {
    expect(this.files['introduction.html'].contents).toEqual(
      '<p><a href="getting-started.html">getting started</a></p>\n'
    )
  })
})
