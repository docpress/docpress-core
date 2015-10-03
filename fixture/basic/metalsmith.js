var bookdown = require('../../')

var app = bookdown(__dirname)

if (module.parent) {
  module.exports = app
} else {
  app.build(function (err) { if (err) throw err })
}
