const compile = require('../../index')()

describe('index/clash:', function () {
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
          '* [My project](../README.md)\n' +
          '* [Intro](../index.md)\n'
      },
      'README.md': {
        contents: '# My project\n'
      },
      'index.md': {
        contents: '# Introduction\n'
      }
    }

    compile(this.files, ms, (err) => {
      if (err) throw err
      done()
    })
  })

  it('renames index.md', function () {
    expect(this.files['index.html']).toExist()
    expect(this.files['index-2.html']).toExist()
  })
})
