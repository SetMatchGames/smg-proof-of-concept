const readlineSync = require('readline-sync')
const jsonfile = require('jsonfile')

const formats = jsonfile.readFileSync('formats.json')
const components = jsonfile.readFileSync('components.json')


var tokenLedger = jsonfile.readFileSync('tokens.json')

const findTopElements = (tokenLedger, elementType) => {
  tokenCounts = {}
  Object.keys(tokenLedger).forEach( u => {
    tokenLedger[u][elementType].forEach( t => {
      if (!(t in tokenCounts)) { tokenCounts[t] = 0 }
      tokenCounts[t] += 1
    })
  })
  console.log(`Top ${elementType}: `)
  Object.keys(tokenCounts).forEach( t => {
    console.log(`${t}: ${tokenCounts[t]}`)
  })
  return tokenCounts
}

// show top elements
findTopElements(tokenLedger, "games")
findTopElements(tokenLedger, "modes")
findTopElements(tokenLedger, "formats")
findTopElements(tokenLedger, "components")

const q = readlineSync.question

// choose game
let game = q("Choose a game [Ro-sham-bo, Double Ro-sham-bo]: ")
if (game === "") { game = "Ro-sham-bo" }

// choose format
let format = q(`Choose a format [${Object.keys(formats)}]: `)
if (format === "") { format = "standard" }

// choose mode
let mode = q("Choose a mode [leaderboard, jesseMillerOnly]: ")
if (mode === "") { mode = "leaderboard" }

const gameComponents = formats[format]

const getRules = (answer) => {
  return {
    choice: answer,
    rules: components[answer]
  }
}

const findWinner = ([p1Name, p1], [p2Name, p2]) => {

  // Check all the options of which choice wins and loses against the other
  // choice
  if (p1.rules.winsAgainst.includes(p2.choice)) {
    return p1Name
  }
  if (p2.rules.winsAgainst.includes(p1.choice)) {
    return p2Name
  }
  if (p1.rules.losesAgainst.includes(p2.choice)) {
    return p2Name
  }
  if (p2.rules.losesAgainst.includes(p1.choice)) {
    return p1Name
  }

  // if there is no unique winner:
  return false

}

const findDoubleWinner = ([p1Name, p1a, p1b], [p2Name, p2a, p2b]) => {
  // play the players' 1st and 2nd choices against each other like regular
  // Ro-sham-bo
  round1 = findWinner([p1Name, p1a], [p2Name, p2a])
  round2 = findWinner([p1Name, p1b], [p2Name, p2b])

  // Add up the number of rounds each player won
  let p1Score = 0
  let p2Score = 0
  if (round1 === p1Name) {
    p1Score += 1
  } else if ( round1 === p2Name ) {
    p2Score += 1
  }
  if (round2 === p1Name) {
    p1Score += 1
  } else if ( round2 === p2Name ) {
    p2Score += 1
  }

  // If one player won more, they win. If not, return false.
  if (p1Score > p2Score) {
    return p1Name
  } else if (p2Score > p1Score) {
    return p2Name
  } else {
    return false
  }

}

// check that players own the correct tokens
const checkTokenType = (tokenList, tokenType, playerLedger, playerName) => {
  let allTokensOwned = true
  tokenList.map( t => {
    if (!playerLedger || !playerLedger[tokenType].includes(t)) {
      console.log(`${playerName} must own at least one "${t}" token to play.`)
      const boughtToken = buyToken(playerName, t, tokenType, tokenLedger)
      if (boughtToken === true) { return }
      allTokensOwned = false
    }
  })
  return allTokensOwned
}

const checkTokens = (game, format, gameComponents, mode, playerName, tokenLedger) => {
  let allTokensOwned = true
  const playerLedger = tokenLedger[playerName]
  let componentsCheck = checkTokenType(gameComponents, "components", playerLedger, playerName)
  let formatCheck = checkTokenType([format], "formats", playerLedger, playerName)
  let gameCheck = checkTokenType([game], "games", playerLedger, playerName)
  let modeCheck = checkTokenType([mode], "modes", playerLedger, playerName)
  if (componentsCheck === false || formatCheck === false || gameCheck === false || modeCheck === false) {
    allTokensOwned = false
  }
  jsonfile.writeFileSync("tokens.json", tokenLedger)
  if (allTokensOwned === false) {
    console.log(`Game can't be played. ${playerName} must own [${gameComponents},${game},${mode},${format}].`)
  }
  return allTokensOwned
}

// let players buy tokens
const buyToken = (playerName, elementName, elementType, tokenLedger) => {
  const buyOrder = q(`Would ${playerName} like to buy 1 "${elementName}" token? [Y/N] `)
  if (buyOrder === 'Y') {
    if (!tokenLedger[playerName]) { tokenLedger[playerName] = {formats: [], components: [], modes: [], games: []} }
    tokenLedger[playerName][elementType].push(elementName)
    return true
  } else if (buyOrder === 'N') {
    console.log(`"${elementName}" token not bought.`)
    return false
  }
  console.log('Invalid response.')
  return false
}

// ask for player names
const p1Name = q("Enter player one's name: ")
const p2Name = q("Enter player two's name: ")

// check that players own the required tokens
const p1OwnsCorrectTokens = checkTokens(game, format, gameComponents, mode, p1Name, tokenLedger)
if (p1OwnsCorrectTokens === false) { process.exit() }
const p2OwnsCorrectTokens = checkTokens(game, format, gameComponents, mode, p2Name, tokenLedger)
if (p2OwnsCorrectTokens === false) { process.exit() }

let winner = false
while (!winner) {
  console.log("No winner yet...")
  if (game === "Double Ro-sham-bo") {
    p1a = getRules(q(`"${p1Name}" choose first component from [${gameComponents}]: `))
    p1b = getRules(q(`"${p1Name}" choose second component from [${gameComponents}]: `))
    p2a = getRules(q(`"${p2Name}" choose first component from [${gameComponents}]: `))
    p2b = getRules(q(`"${p2Name}" choose second component from [${gameComponents}]: `))
    winner = findDoubleWinner([p1Name, p1a, p1b], [p2Name, p2a, p2b])
  } else {
    p1 = getRules(q(`"${p1Name}" choose a component from [${gameComponents}]: `))
    p2 = getRules(q(`"${p2Name}" choose a component from [${gameComponents}]: `))
    winner = findWinner([p1Name, p1], [p2Name, p2])
  }
}

var results = jsonfile.readFileSync("results.json")

results.push({
  "game": game,
  "format": format,
  "players": [p1Name, p2Name],
  "winner": winner
})

jsonfile.writeFileSync("results.json", results)

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
  results = results.filter(
    r => r.players.includes("Jesse") && r.players.includes("Miller") && r.players.length === 2
  )
  leaderboardMode(results)
}

const modes = {
  "leaderboard": leaderboardMode,
  "jesseMillerOnly": jesseMillerOnlyMode
}

modes[mode](results.filter(r => r.game === game && r.format === format))
