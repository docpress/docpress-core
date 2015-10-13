'use strict'

const slugify = require('../lib/slugify')

describe('slugify', function () {
  function test (input, output) {
    it(`${input} → ${output}`, function () {
      expect(slugify(input)).toEqual(output)
    })
  }

  test('', undefined)
  test('hi', 'hi')
  test('usage.html', 'usage')
  test('/foo/index.html', 'foo')
  test('index.html', 'index')
})
