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
  layout($, 'Выбор темы')
}

async function list($) {
  let res = $.res
  await bcz.open($)
  await bcz.item($, 'Оформление', true)
  await bcz.close($)

  let thz = themes.names
  const current = themes.get($)

  res.write(`
    <form method="POST"><div class="text-center">
    <input type="hidden" name="ref" value="${html($.req.headers.referer)}"/>
    `)
  for (let theme of thz) {
    let active = theme==current.name
    res.write(`
      <span class="card${active ? ' bg-success' : ''}">
      <label class="form-check-label"><input class="form-check-input" type="radio"
        name="theme" value="${theme}" ${active ? 'checked' : ''} required>
      ${html(theme.replace(/\w/, c => c.toUpperCase()))}
      </label>&nbsp;
      <a href="${themes.url}${theme}" target="bootswatch"><i class="fa fa-eye"></i></a>
      </span>
      `
      .trimStart())
  }
  res.write(`
    <hr>
    <label class="form-check-label"><input class="form-check-input" type="checkbox" ${current.dark ? 'checked' : ''} name="dark">
    Потемнее
    </label>
    <p></p>
    <button type="submit" class="btn btn-primary">
    <i class="fa fa-floppy-o fa-lg text-dark"></i>
    Сохранить
    </button>
    </div>
    <script src="${$.base}assets/theme.js"></script>
    `)
}

async function post($) {
  let { theme, dark, ref } = qs.decode(await read($.req))
  let ref2 = $.req.headers.referer

  let refA = new URL($.base, ref).toString()
  let refB = new URL($.base, ref).toString()

  let redir2 = refA == refB && ref.startsWith(refA) && ref2.startsWith(refB) ?
    ref
    :
    '/'

  if (!themes.names.includes(theme))
    theme = themes.std
  let cookie = theme
  if (dark)
    cookie += '!'
  $.res.setHeader('Set-Cookie', `theme=${qs.escape(cookie)}; HttpOnly; Path=${$.base}`)
  $.res.writeHead(301, { Location: redir2 })
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
