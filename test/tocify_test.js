const tocify = require('../lib/tocify')

describe('tocify', function () {
  var output

  it('works', function () {
    output = tocify([
      '* [Readme](/README.md)'
    ].join('\n'))

    expect(output).toEqual({
      sections: [
        {
          title: 'Readme',
          url: 'index.html',
          source: 'README.md'
        }
      ]
    })
  })

  it('handles non-links', function () {
    output = tocify([
      '* Readme'
    ].join('\n'))

    expect(output).toEqual({
      sections: [
        {
          title: 'Readme'
        }
      ]
    })
  })

  it('takes care of nesting', function () {
    output = tocify([
      '* [Readme](/README.md)',
      '* Getting Started',
      '  * [Install](/docs/install.md)',
      '  * [Usage](/docs/usage.md)'
    ].join('\n'))

    expect(output).toEqual({
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
              url: 'install.html',
              source: 'docs/install.md'
            },
            {
              title: 'Usage',
              url: 'usage.html',
              source: 'docs/usage.md'
            }
          ]
        }
      ]
    })
  })

  it('takes care of nesting', function () {
    output = tocify([
      '* [Readme](/README.md)',
      '* Getting Started',
      '  * [Install](/docs/install.md)',
      '  * [Usage](/docs/usage.md)'
    ].join('\n'))

    expect(output).toEqual({
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
              url: 'install.html',
              source: 'docs/install.md'
            },
            {
              title: 'Usage',
              url: 'usage.html',
              source: 'docs/usage.md'
            }
          ]
        }
      ]
    })
  })

  it('handles relative URLs', function () {
    output = tocify([
      '* [Readme](../README.md)',
      '* [Install](install.md)'
    ].join('\n'))

    expect(output).toEqual({
      sections: [
        {
          title: 'Readme',
          url: 'index.html',
          source: 'README.md'
        },
        {
          title: 'Install',
          url: 'install.html',
          source: 'docs/install.md'
        }
      ]
    })
  })

  it('handles extreme ../ in URLs', function () {
    output = tocify([
      '* [Readme](../docs/../README.md)',
      '* [Install](../docs/../docs/install.md)'
    ].join('\n'))

    expect(output).toEqual({
      sections: [
        {
          title: 'Readme',
          url: 'index.html',
          source: 'README.md'
        },
        {
          title: 'Install',
          url: 'install.html',
          source: 'docs/install.md'
        }
      ]
    })
  })
})
