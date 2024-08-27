//
// Parse HTTP Cookies
//
module.exports = cookies

function cookies($) {
  return Object.fromEntries(
    ($.req.headers.cookie || '')
      .split(/\s*;\s*/)
      .toReversed()
      .map(x =>
        x
          .split(/\s*=\s*/, 2)
          .map(decodeURIComponent))
  )
}
