'use strict'

const tocifyPage = require('../lib/tocify_page')

describe('tocifyPage()', function () {
  let output

  beforeEach(function () {
    output = tocifyPage([
      '# Hello',
      '## Usage',
      '## Installation',
      '### via npm',
      '### via Bower',
      '## Thanks'
    ].join('\n') + '\n')
  })

  it('renders titles', function () {
    expect(output.map((h) => h.title)).toEqual([
      'Usage',
      'Installation',
      'via npm',
      'via Bower',
      'Thanks'
    ])
  })

  it('renders ids', function () {
    expect(output.map((h) => h.id)).toEqual([
      'usage',
      'installation',
      'via-npm',
      'via-bower',
      'thanks'
    ])
  })

  it('renders depths', function () {
    expect(output.map((h) => h.depth)).toEqual([
      2, 2, 3, 3, 2
    ])
  })
})
