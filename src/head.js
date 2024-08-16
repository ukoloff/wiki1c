//
// Output HTML preamble
//
module.exports = head

head.tail = tail

function head(res, title) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.write(`<!DOCTYPE html><html><head><title>${title}</title></head><body>`)
}

function tail(res) {
  res.end(`</body></html>`)
}
