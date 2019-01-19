const jsonfile = require('jsonfile')

const leaderboardMode = (results) => {
  let winners = {}
  results.forEach(r => {
    if (winners[r.winner] === undefined) {
      winners[r.winner] = 1
    } else {
      winners[r.winner] += 1
    }
  })
  console.log(winners)
}

var results = jsonfile.readFileSync("results.json")

leaderboardMode(results)

