//
// Select space according to URL
//
const spaces = require('./spaces')

module.exports = select

function select($) {
  $.space = spaces[String($.base).replace(/(^\/+|\/+$)/g, '')] || spaces['*']
}
