const tocify = require('../lib/tocify')

describe('tocify', function () {
  var toc = [
    '# toc',
    '',
    '* [readme](/README.md)',
  ].join('\n')

  var output

  it('works', function () {
    output = tocify([
      '* [Readme](/README.md)',
    ].join('\n'))

    expect(output).toEqual({
      sections: {
        readme: {
          title: 'Readme',
          source: '/README.md'
        }
      }
    })
  })

  it('handles non-links', function () {
    output = tocify([
      '* Readme',
    ].join('\n'))

    expect(output).toEqual({
      sections: {
        readme: {
          title: 'Readme'
        }
      }
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
      sections: {
        readme: {
          title: 'Readme',
          source: '/README.md',
        },
        'getting-started': {
          title: 'Getting Started',
          sections: {
            'install': {
              title: 'Install',
              source: '/docs/install.md',
            },
            'usage': {
              title: 'Usage',
              source: '/docs/usage.md',
            }
          }
        }
      }
    })
  })

})
