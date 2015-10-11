const compile = require('../../index')()

describe('compile: docpress.json', function () {
  beforeEach(function (done) {
    // Mock metalsmith object
    this.ms = {
      metadata () {
        return { docs: 'docs' }
      }
    }

    this.files = {
      'README.md': { contents: '# hello\n' },
      'docs/README.md': { contents: '* [README](../README.md)' },
      'docpress.json': { contents: '{}' }
    }

    compile(this.files, this.ms, (err) => {
      if (err) throw err
      done()
    })
  })

  xit('removes docpress.json', function () {
    expect(this.files['docpress.json']).toNotExist()
  })
})
