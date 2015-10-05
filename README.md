# docpress-core

Metalsmith plugin to generate Docpress site data from a project. Part of the [Docpress] project.

This plugin generates bare HTML files (just rendered from Markdown) from a project. It also creates a `toc.json` (Table of contents) and `index.json` (Page index). This is usually used with [docpress-base], which will then prettify those pages into a full-fleged website.

## How it works

Make a TOC in `docs/README.md`. This will be used to crawl the project for files to be parsed. Here's an example structure:

```
README.md
docs/
  README.md
  usage.md
  installation.md
  getting-started.md
```

## API

You get these modules:

- `docpress-core` The main Metalsmith middleware.
- `docpress-core/ms` - Metalsmith instance generator.

You use them together like so:

```js
var app = require('docpress-core/ms')(cwd)
  .use(require('docpress-core')())
  .use(require('docpress-base')())
```

[Docpress]: https://github.com/docpress/docpress
[docpress-base]: https://github.com/docpress/docpress-base
