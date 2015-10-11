# docpress-core

Metalsmith plugin to generate Docpress site data from a project. Part of the [Docpress] project.

[![Status](https://travis-ci.org/docpress/docpress-core.svg?branch=master)](https://travis-ci.org/docpress/docpress-core "See test builds")

## What it does

This plugin generates _bare_ HTML files (just rendered from Markdown) from a project. It also creates a `_docpress.json` with table of contents and index. This is usually used with [docpress-base], which will then prettify those pages into a full-fleged website.

## API

You get these modules:

- `docpress-core` The main Metalsmith middleware.
- `docpress-core/ms` - Metalsmith instance generator.

In a bare Metalsmith site, you use them together like so:

```js
var app = require('docpress-core/ms')(cwd)
  .use(require('docpress-core')())
  .use(require('docpress-base')())
```

[Docpress]: https://github.com/docpress/docpress
[docpress-base]: https://github.com/docpress/docpress-base
