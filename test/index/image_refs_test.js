const compile = require('../../index')()

describe('index/image refs:', function () {
  beforeEach(function (done) {
    // Mock metalsmith object
    var ms = {
      metadata () {
        return { docs: 'docs' }
      }
    }

    this.files = {
      'docs/README.md': {
        contents: '* [Readme](/README.md)\n'
      },
      'README.md': {
        contents: '![](docs/images/screenshot.png)\n'
      },
      'docs/images/screenshot.png': {
        contents: '...'
      }
    }

    compile(this.files, ms, (err) => {
      if (err) throw err
      done()
    })
  })

  it('works', function () {
    expect(this.files['index.html'].contents).toEqual(
      '<p><img src="docs/images/screenshot.png" alt=""></p>\n'
    )
  })
})
