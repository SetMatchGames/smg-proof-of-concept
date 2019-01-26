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

const inviteList = ["Jesse", "Miller", "Ezra", "Weller"]

leaderboardMode(results.filter(
  r => inviteList.includes(r.players[0])
    && inviteList.includes(r.players[1])
))

