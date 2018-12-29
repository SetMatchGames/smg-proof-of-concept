const fs = require('fs')
const readlineSync = require('readline-sync')

const formats = JSON.parse(fs.readFileSync('formats.json', 'utf8'))
const components = JSON.parse(fs.readFileSync('components.json', 'utf8'))

const q = readlineSync.question

let format = q(`Choose a format [${Object.keys(formats["Ro-sham-bo"])}] `)
if (format === "") {
  format = "standard"
}
const gameComponents = formats["Ro-sham-bo"][format]

const getRules = (answer) => {
  return {
    choice: answer,
    rules: components["Ro-sham-bo"][answer]
  }

}

const findWinner = (p1, p2) => {
  let p1Wins = false
  let p2Wins = false

  // Check all the options of which choice wins and loses against the other
  // choice
  if (p1.rules.winsAgainst.includes(p2.choice)) {
    p1Wins = true
  }
  if (p2.rules.winsAgainst.includes(p1.choice)) {
    p2Wins = true
  }
  if (p1.rules.losesAgainst.includes(p2.choice)) {
    p2Wins = true
  }
  if (p2.rules.losesAgainst.includes(p1.choice)) {
    p1Wins = true
  }

  // if there is a unique winner return that winner

  if (p1Wins === p2Wins) {
    return false
  }

  if (p1Wins) {
    return 1
  }

  return 2
}

let p1, p2
let winner = false
while (!winner) {
  console.log("No winner yet...")
  p1 = getRules(q(`Player one choose a component from [${gameComponents}]: `))
  p2 = getRules(q(`Player two choose a component from [${gameComponents}]: `))

  winner = findWinner(p1, p2)
}

console.log("Plyer", winner, "Wins.")
