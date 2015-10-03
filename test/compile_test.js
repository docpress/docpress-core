const compile = require('../lib/compile')()

describe('compile', function () {
  beforeEach(function (done) {
    var ms = {}
    this.files = {
      'docs/README.md': {
        contents: [
          '# toc',
          '',
          '* [Readme](/README.md)',
          '* [Getting started](/docs/getting-started.md)'
        ].join('\n') + '\n'
      },
      'docs/getting-started.md': {
        contents: '# getting started\n'
      },
      'README.md': {
        contents: '# hello\n'
      }
    }

    compile(this.files, ms, (err) => {
      if (err) throw err
      done()
    })
  })

  it('renders index.html', function () {
    const idx = this.files['index.html']
    expect(idx).toBeAn('object')
    expect(idx.title).toEqual('Readme')
    expect(idx.contents).toEqual('<h1 id="hello">hello</h1>\n')
    expect(idx.markdown).toBeA('string')
    expect(idx.source).toEqual('README.md')
  })

  describe('toc.json:', function () {
    beforeEach(function () {
      this.tocFile = this.files['toc.json']
      this.toc = JSON.parse(this.tocFile.contents)
    })

    it('renders.json', function () {
      expect(this.toc.sections).toBeAn('array')
      expect(this.toc.sections.length).toEqual(2)
    })

    it('renders the first section', function () {
      const section = this.toc.sections[0]
      expect(section).toBeAn('object')
      expect(section).toEqual({
        title: 'Readme',
        source: 'README.md',
        url: 'index.html'
      })
    })
  })
})
