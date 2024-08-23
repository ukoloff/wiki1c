console.log('Hello, world!')

let res = await fetch('/api/', {
  method: 'POST',
  body: JSON.stringify({ command: 'tree' })
})
let data = await res.json()

console.log('JSON', data)
