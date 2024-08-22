console.log('Hello, world!')

let res = await fetch('/api/', {method: 'POST'})
let data = await res.json()

console.log('JSON', data)
