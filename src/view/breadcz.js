//
// Render Breadcrumbs
//
const html = require('./h')
const space = require('../model/space')

exports.open = open
exports.close = close
exports.item = item

async function open($) {
  let res = $.res
  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')
  await item($, `<a href="${$.base}">${html(await space())}</a>`)
}

async function close($) {
  $.res.write('</ol></nav>\n')
}

async function item($, html, active = false) {
  $.res.write(`<li class="breadcrumb-item${active ? ' active' : ''}">${html}</li>\n`)
}
