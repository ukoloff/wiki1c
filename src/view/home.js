//
// Home page
//
const layout = require('./layout')
const search = require('./search')

module.exports = home

async function home($) {
  $.content = search
  layout($)
}
