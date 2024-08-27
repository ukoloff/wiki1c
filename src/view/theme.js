//
// Show themes to select
//
const layout = require('./layout')
const bcz = require('./breadcz')

module.exports = theme

async function theme($) {
  $.content = list
  layout($)
}

async function list($) {
  await bcz.open($)
  await bcz.item($, 'Оформление', true)
  await bcz.close($)

  $.res.write('Hello, world!')
}
