const indexify = require('../lib/indexify')

describe('indexify', function () {
  const toc = {
    sections: [
      {
        title: 'Readme',
        url: 'index.html',
        source: 'README.md',
        slug: 'index'
      },
      {
        title: 'Getting Started',
        sections: [
          {
            title: 'Install',
            url: 'docs/install.html',
            source: 'docs/install.md',
            slug: 'install'
          },
          {
            title: 'Usage',
            url: 'docs/usage.html',
            source: 'docs/usage.md',
            slug: 'usage'
          }
        ]
      }
    ]
  }

  it('index works', function () {
    const res = indexify(toc)
    expect(res.index).toEqual({
      'docs/install.html': {
        source: 'docs/install.md', title: 'Install', slug: 'install'
      },
      'docs/usage.html': {
        source: 'docs/usage.md', title: 'Usage', slug: 'usage'
      },
      'index.html': {
        source: 'README.md', title: 'Readme', slug: 'index'
      }
    })
  })
})
