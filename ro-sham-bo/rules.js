function startGame(actionInfo) {

  const newBoardState = {
    player1: {
      hand: actionInfo.components,
      id: actionInfo.player1.id
    },
    player2: {
      hand: actionInfo.components,
      id: actionInfo.player2.id
    }
  }

  console.log("Game starting.")
  return newBoardState;
}

function playRound(boardState, actionInfo) {
  var result = "Error";
  const player1Choice = actionInfo.player1.playedComponent;
  const player2Choice = actionInfo.player2.playedComponent;
  if (player1Choice !== player2Choice) {
    if (boardState.player1.hand[player1Choice].rules.winsAgainst
          .includes(boardState.player2.hand[player2Choice].name)) {
      result = `Player 1 wins (Player 1: ${player1Choice}, Player 2: ${player2Choice}).`;
    } else {
      result = `Player 2 wins (Player 1: ${player1Choice}, Player 2: ${player2Choice}).`;
    }
  } else {
    result = `Draw (Player 1: ${player1Choice}, Player 2: ${player2Choice}).`;
  }
  console.log("Actions resolved.")
  return result;
}

module.exports = { startGame, playRound }
