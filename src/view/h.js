// HTML escaping
module.exports = h

var htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }

function h(s) {
  return String(s).replace(/[&<>"]/g, e => htmlEntities[e])
}
