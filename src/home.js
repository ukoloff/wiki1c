//
// Home page
//
const layout = require('./layout')

module.exports = home

async function home(res) {
  layout(res, 'База знаний', nop)
}

function nop() {
}
