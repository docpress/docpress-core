const compile = require('../../index')()

describe('index/fix refs:', function () {
  beforeEach(function (done) {
    // Mock metalsmith object
    var ms = {
      metadata () {
        return { docs: 'docs' }
      }
    }

    this.files = {
      'docs/README.md': {
        contents: [
          '# toc',
          '',
          '* [Readme](/README.md)',
          '* [Getting started](/docs/getting-started.md)'
        ].join('\n') + '\n'
      },
      'README.md': {
        contents: '[getting started](docs/getting-started.md)'
      },
      'docs/getting-started.md': {
        contents: 'hi'
      }
    }

    compile(this.files, ms, (err) => {
      if (err) throw err
      done()
    })
  })

  it('works', function () {
    expect(this.files['index.html'].contents).toEqual(
      '<p><a href="getting-started.html">getting started</a></p>\n'
    )
  })
})
