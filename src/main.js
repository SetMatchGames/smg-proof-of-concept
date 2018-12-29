const fs = require('fs')
const readlineSync = require('readline-sync')

const formats = JSON.parse(fs.readFileSync('formats.json', 'utf8'))
const components = JSON.parse(fs.readFileSync('components.json', 'utf8'))

const q = readlineSync.question

let format = q(`Choose a format [${Object.keys(formats["Ro-sham-bo"])}] `)
if (format === "") {
  format = "standard"
}
// hardcode game and mode
const game = "Ro-sham-bo"
let mode = q("Choose a mode (default: leaderboard) ")
if(mode === "") {
  mode = "leaderboard"
}

const gameComponents = formats[game][format]

const getRules = (answer) => {
  return {
    choice: answer,
    rules: components[game][answer]
  }
}

const findWinner = ([p1Name, p1], [p2Name, p2]) => {
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
    return p1Name
  }

  return p2Name
}

const p1Name = q("Enter player one's name: ")
const p2Name = q("Enter player two's name: ")
let p1, p2
let winner = false
while (!winner) {
  console.log("No winner yet...")
  p1 = getRules(q(`Player one choose a component from [${gameComponents}]: `))
  p2 = getRules(q(`Player two choose a component from [${gameComponents}]: `))

  winner = findWinner([p1Name, p1], [p2Name, p2])
}

var results = JSON.parse(fs.readFileSync('results.json', 'utf8'))
results.push({
  "game": game,
  "format": format,
  "players": [p1Name, p2Name],
  "winner": winner
})

fs.writeFileSync("results.json", JSON.stringify(results))

const leaderboardMode = (results) => {
  let winners = {}
  results.forEach((r) => {
    if (winners[r.winner] === undefined) {
      winners[r.winner] = 1
    } else {
      winners[r.winner] += 1
    }
  })
  console.log(winners)
}

const jesseMillerOnlyMode = (results) => {
  console.log(results)
  results = results.filter(
    r => r.players.includes("Jesse") && r.players.includes("Miller") && r.players.length === 2
  )
  console.log(results)
  leaderboardMode(results)
}

const modes = {
  "leaderboard": leaderboardMode,
  "jesseMillerOnly": jesseMillerOnlyMode
}

modes[mode](results.filter(r => r.game === game && r.format === format))
