const indexify = require('../lib/indexify')

describe('indexify', function () {
  const toc = {
    sections: [
      {
        title: 'Readme',
        url: 'index.html',
        source: 'README.md'
      },
      {
        title: 'Getting Started',
        sections: [
          {
            title: 'Install',
            url: 'docs/install.html',
            source: 'docs/install.md'
          },
          {
            title: 'Usage',
            url: 'docs/usage.html',
            source: 'docs/usage.md'
          }
        ]
      }
    ]
  }

  it('works', function () {
    const index = indexify(toc)
    expect(index).toEqual({
      'docs/install.html': { source: 'docs/install.md' },
      'docs/usage.html': { source: 'docs/usage.md' },
      'index.html': { source: 'README.md' }
    })
  })
})
