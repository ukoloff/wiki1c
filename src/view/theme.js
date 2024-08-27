//
// Show themes to select
//
const html = require('./h')
const layout = require('./layout')
const bcz = require('./breadcz')
const themes = require('../model/themes')

module.exports = theme

async function theme($) {
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
      `
      .trim())
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
