//
// Show themes to select
//
const qs = require('node:querystring')
const html = require('./h')
const layout = require('./layout')
const bcz = require('./breadcz')
const themes = require('../model/themes')

module.exports = theme

async function theme($) {
  if ($.req.method == 'POST')
    return post($)
  $.content = list
  layout($)
}

async function list($) {
  let res = $.res
  await bcz.open($)
  await bcz.item($, 'Оформление', true)
  await bcz.close($)

  let tz = await themes()
  let thz = tz.names
  thz.sort()

  res.write('<form method="POST"><div class="text-center">')
  for (let theme of thz) {
    res.write(`
      <label class="form-check-label"><input class="form-check-input" type="radio" name="theme" value="${theme}" required>
      ${html(theme.replace(/\w/, c => c.toUpperCase()))}
      </label>
      <a href="${tz.url}${theme}" target="bootswatch"><i class="fa fa-eye"></i></a>
      `
      .trimStart())
  }
  res.write(`
    <hr>
    <label class="form-check-label"><input class="form-check-input" type="checkbox" name="dark">
    Потемнее
    </label>
    <p></p>
    <button type="submit" class="btn btn-primary">
    Сохранить
    </button>
    </div>
    `)
}

async function post($) {
  let { theme, dark } = qs.decode(await read($.req))
  let thz = await themes()
  if (!thz.names.includes(theme))
    theme = 'litera'
  let cookie = theme
  if (dark)
    cookie += '!'
  $.res.setHeader('Set-Cookie', `theme=${qs.escape(cookie)}; HttpOnly; Path=${$.base}`)
  $.res.writeHead(301, { Location: '/' })
    .end()
}

function read(stream) {
  return new Promise((resolve, reject) => {
    var body = ''
    stream
      .on('data', chunk => body += chunk)
      .on('end', _ => resolve(body))
      .on('error', reject)
  })
}
