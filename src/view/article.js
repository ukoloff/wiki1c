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

const shorten = require('../model/shorten')

module.exports = render

async function render($) {
  let res = $.res
  $.content = content
  layout($, $.page.title)
}

async function content($) {
  let res = $.res
  await breadcrumbs($)
  let x = await shorten($.page.id)
  res.write(`<!-- min page id: ${$.page.id.slice(0, x).toString('hex')} -->\n`)
  res.write(md(await unspace($)))
}

async function breadcrumbs($) {
  await bcz.open($)

  for await (var row of await breadcx($)) {
    await bcz.item($, html(decyfer(row.title)), !row.lvl)
  }
  await bcz.close($)
}
