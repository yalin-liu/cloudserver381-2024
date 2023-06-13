const fs = require('fs')

// Sync version
const data = fs.readFileSync('input.txt')

console.log(data.toString())
console.log('Program Ended')

