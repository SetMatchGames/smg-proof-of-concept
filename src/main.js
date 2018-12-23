const fs = require('fs')
const readlineSync = require('readline-sync')

const formats = JSON.parse(fs.readFileSync('formats.json', 'utf8'))
const components = JSON.parse(fs.readFileSync('components.json', 'utf8'))

const q = readlineSync.question

const format = q(`Choose a format [${Object.keys(formats["Ro-sham-bo"])}] `)
const gameComponents = formats["Ro-sham-bo"][format]

const getRules = (answer) => {
  return {
    choice: answer,
    rules: components["Ro-sham-bo"][answer]
  }

}

let p1, p2
let winner = false
while (!winner) {
  p1 = getRules(q(`Player one choose a component from [${gameComponents}]: `))
  p2 = getRules(q(`Player two choose a component from [${gameComponents}]: `))

  console.log("P1", p1)
  console.log("P2", p2)
  winner = true
}
