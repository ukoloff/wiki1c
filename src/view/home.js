//
// Home page
//
const layout = require('./layout')
const search = require('./search')

module.exports = home

async function home(res) {
  layout(res, 'База знаний', search)
}
