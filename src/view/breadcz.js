//
// Render Breadcrumbs
//
const html = require('./h')
const space = require('../model/space')

exports.open = open
exports.close = close
exports.item = item

async function open(res) {
  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')
  await item(res, `<a href="${res.$base}">${html(await space())}</a>`)
}

async function close(res) {
  res.write('</ol></nav>\n')
}

async function item(res, html, active = false) {
  res.write(`<li class="breadcrumb-item${active ? ' active' : ''}">${html}</li>\n`)
}
