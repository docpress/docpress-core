describe('to do', function () {
  describe('done', function () {
    it('parsing toc', done)
    it('flattening toc to index', done)
    it('rendering pages', done)
    it('strip out docs/ prefix', done)
    it('test fail cases', done)
    it('prettifying pages', done)
    it('handle relative urls', done)
    it('validating toc', done)
    it('index sub-toc', done)
    it('expand mode', done) /* make it bold in the TOC */
    it('bug: linking pages inside sub-directories', done)
    it('bug: linking pages with absolute references', done)
    it('bug: linking to #anchors', done)
    it('bug: linking to #anchors in toc', done)
    it('link urls (http://...)', done)
    it('single readme mode', done)
    it('account for links in headings', done)
    it('account for question marks in headings', done)
  })

  describe('config', function () {
    it('load from docpress.json root')
    it('load from package.json')
    it('ignore docpress.json')
    it('override docs/')
  })

  describe('diff homepage', function () {
    it('allow linking of table of contents (!)')
    it('custom homepage instead of readme.md (!)')
  })

  describe('transforming html', function () {
    it('transforming links in document', done)
    it('syntax highlighting', done)
    it('set meta description')
  })

  describe('to do', function () {
    it('warn when no pages are parsed')
    it('move loading plugins into docpress-core/ms')
  })

})

function done () {}
