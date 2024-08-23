//
// Remove numeration
//
module.exports = trim

function trim(s) {
  return s.replace(/^(\d|[a-z])[.]\s*/, '')
}
