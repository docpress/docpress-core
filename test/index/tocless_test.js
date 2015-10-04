const compile = require('../../index')()

describe('compile: toc-less', function () {
  beforeEach(function (done) {
    // Mock metalsmith object
    this.ms = {
      metadata () {
        return { docs: 'docs' }
      }
    }

    this.files = {
      'README.md': { contents: '# hello\n' }
    }

    compile(this.files, this.ms, (err) => {
      this.err = err
      done()
    })
  })

  it('fails', function () {
    expect(this.err).toExist()
    expect(this.err.message).toMatch(/not found/)
  })
})
