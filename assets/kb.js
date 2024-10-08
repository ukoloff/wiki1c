!(function () {
  let base = "/"

  let aStorage = window.sessionStorage || window.localStorage || {}

  if (aStorage.split)
    document.documentElement.style.setProperty('--split-ratio', aStorage.split + '%')

  document.addEventListener("DOMContentLoaded", ready, { once: true })

  function ready() {
    let leftPane = document.querySelector('body>:first-child>*')
    base = document.querySelector('script[src^="/"]').getAttribute('src').replace(/assets.*/, '')

    putLeftPane()
    loadLeftPane()

    var splitter = document.querySelector('body>:nth-child(3)')

    splitter.addEventListener('mousedown', click)
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)

    var fired = false

    function putLeftPane() {
      renderLeftPane(json(aStorage.tree))
    }

    async function loadLeftPane() {
      let res = await fetch(base + 'api/', {
        method: 'POST',
        body: JSON.stringify({
          command: 'tree',
          hash: (json(aStorage.tree) || {}).hash
        })
      })
      let data = await res.json()
      if (data.the == 'same')
        return
      aStorage.tree = JSON.stringify(data)
      renderLeftPane(data)
    }

    function renderLeftPane(tree) {
      if (!tree || !tree.c)
        return
      leftPane.innerHTML = renderTree(tree)
      leftPane.querySelectorAll('details').forEach(el =>
        el.addEventListener('toggle', updateExp))
    }

    function renderTree(page, state = expStatus(), level = 1) {
      return page.c
        .map(function (page) {
          if (page.leaf) {
            return `<div><a href="${base}${page.id}/" title="${h(page.title)}">${h(page.title)}</a></div>`
          } else {
            let result = `<details id=":${page.id}" name="$${level}"${state[':' + page.id] ? ' open' : ''
              }><summary title="${h(page.title)}">${h(page.title)}</summary>`
            if (page.c.length > 0) {
              result += '<div>' + renderTree(page, state, level + 1) + '</div>'
            }
            return result + '</details>'
          }
        })
        .join('')
    }

    function click(ev) {
      if (fired) return
      ev.preventDefault()
      fired = true
      splitter.classList.add('active')
    }

    function move(ev) {
      if (!fired) return
      var r = Math.round(ev.clientX / splitter.parentNode.clientWidth * 100)
      r = Math.min(95, Math.max(5, r))
      aStorage.split = r
      document.documentElement.style.setProperty('--split-ratio', r + '%')
    }

    function up(ev) {
      if (!fired) return
      fired = false
      splitter.classList.remove('active')
    }

    function updateExp() {
      var list = []
      document.querySelectorAll('details[open]').forEach(z => list.push(z.id))
      aStorage.expand = JSON.stringify(list)
    }
  }
  var htmlEntities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }

  function h(s) {
    return String(s).replace(/[&<>"]/g, e => htmlEntities[e])
  }

  function json(text) {
    try {
      return JSON.parse(text)
    } catch (e) { }
  }

  function expStatus() {
    let result = {}
    for (let id of json(aStorage.expand) || []) {
      result[id] = 1
    }
    return result
  }
})()
