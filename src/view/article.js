//
// Render KB page
//
const html = require('./h')
const md = require('../model/md')
const layout = require('./layout')
const space = require('../model/space')
const decyfer = require('../model/decyfer')
const breadcx = require('../model/breadcx')
const unspace = require('../model/unspace')

module.exports = render

async function render(res, page) {
  layout(res, page.title, content)

  async function content() {
    await breadcrumbs(res, page)
    res.write(md(await unspace(page)))
  }
}

async function breadcrumbs(res, page) {
  res.write('<nav aria-label="breadcrumb"><ol class="breadcrumb">')
  res.write(`<li class="breadcrumb-item"><a href="${res.$base}">${html(await space())}</a></li>\n`)

  for await (var row of await breadcx(page)) {
    res.write(`<li class="breadcrumb-item">${html(decyfer(row.title))}</li>\n`)
  }
  res.write(`</ol></nav>`)
}
