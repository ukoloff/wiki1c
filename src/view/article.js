//
// Render KB page
//
const html = require('./h')
const md = require('../model/md')
const layout = require('./layout')
const bcz = require('./breadcz')
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
  await bcz.open(res)

  for await (var row of await breadcx(page)) {
    await bcz.item(res, html(decyfer(row.title)), !row.lvl)
  }
  await bcz.close(res)
}
