const mdi = require('markdown-it')
const mdc = require('markdown-it-container')

module.exports = md

function md(md) {
  var mdx = mdi({
    html: true,
    linkify: true,
    typographer: true,
    quotes: '«»‘’',
  })
    .use(mdc, 'info', { marker: '!' })

  var
    defI = mdx.renderer.rules.image,
    defA = mdx.renderer.rules.link_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      }

  mdx.renderer.rules.image = function (tokens, idx, options, env, self) {
    fixHref(tokens[idx], 'src')
    tokens[idx].attrSet('class', 'img-fluid')

    return defI(tokens, idx, options, env, self);
  }

  mdx.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    fixHref(tokens[idx], 'href')
    return defA(tokens, idx, options, env, self);
  }

  return mdx.render(md)
}

function fixHref(token, attr) {
  var val = token.attrGet(attr)
  if (/^\/[^\/]+$/.test(val)) {
    token.attrSet(attr, val.substr(1))
  }
}
