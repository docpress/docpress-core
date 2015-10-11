const compile = require('../../index')()

describe('index/toc with anchor:', function () {
  beforeEach(function (done) {
    // Mock metalsmith object
    var ms = {
      metadata () {
        return { docs: 'docs' }
      }
    }

    this.files = {
      'docs/README.md': {
        contents: '* [Intro](intro.md#xyz)'
      },
      'docs/intro.md': {
        contents: '# Introduction\n'
      }
    }

    compile(this.files, ms, (err) => {
      if (err) throw err
      done()
    })
  })

  it('renders', function () {
    expect(this.files['intro.html']).toExist()
  })

  it('sets .anchor', function () {
    expect(this.files['_docpress.json'].toc.sections[0].anchor).toEqual('#xyz')
  })
})
