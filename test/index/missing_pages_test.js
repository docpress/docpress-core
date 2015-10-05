const compile = require('../../index')()

describe('compile: missing pages', function () {
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
        contents: '# hello\n'
      }
    }

    compile(this.files, ms, (err) => {
      this.err = err
      done()
    })
  })

  it('works', function () {
    expect(this.err).toExist()
    expect(this.err.message).toEqual(`Invalid reference 'docs/getting-started.md'`)
  })
})
