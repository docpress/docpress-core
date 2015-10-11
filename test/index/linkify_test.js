const compile = require('../../index')()

describe('index/linkify:', function () {
  beforeEach(function (done) {
    // Mock metalsmith object
    var ms = {
      metadata () {
        return { docs: 'docs' }
      }
    }

    this.files = {
      'docs/README.md': {
        contents: '* [Intro](intro.md)'
      },
      'docs/intro.md': {
        contents: 'http://google.com'
      }
    }

    compile(this.files, ms, (err) => {
      if (err) throw err
      done()
    })
  })

  it('renders', function () {
    expect(this.files['intro.html'].contents.toString()).toInclude('<a href="http://google.com">')
  })
})
