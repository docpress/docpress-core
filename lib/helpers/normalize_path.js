module.exports = function fixSlashes (url) {
  if (!url) {
    return url
  }
  url = url.replace(/\\\\/g, '/')
    .replace(/\\/g, '/')

  return url;
}