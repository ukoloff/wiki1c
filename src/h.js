// HTML escaping
module.exports = h

var htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }

function h(s) {
  return String(s).replace(/[&<>"]/g, function (e) { return htmlEntities[e] })
}
