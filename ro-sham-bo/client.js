/*

On start:
  Takes in accounts, rules (required) & mode, format (optional)

After start:
  Prompts players for actions, feeds actions into the rules

When rules say game ends:
  Sends results to mode

*/

const readline = require('readline');
const account1 = require("./account1.json");
const account2 = require("./account2.json");
const format   = require("./format.json");
const mode     = require("./mode.js");
const rules    = require("./rules.js");

process.stdin.setEncoding('utf8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function logInPrompt() {
  // ask player to log in
  rl.question(`Enter your username: `, (answer) => {
    if (answer === 'Ezra') {
      rl.question(`Enter password for Ezra: `, (answer) => {
        if (answer === 'password') {
          console.log("Logged in as Ezra.");
          menu();
        }
      });
      // findMatch() {}
    } else {
      // Logout
      console.log('User not found.');
      rl.close();
      logInPrompt();
    }
  });
}

function logIn() {

}

function logOut() {

}

function menu() {
  // ask player if they want to find match or logout
  rl.question(`What would you like to do? (Play or Logout): `, (answer) => {

    if (answer === 'Play') {
      playRoShamBo([account1, account2], format);
      // findMatch() {}
    } else if (answer === 'Logout') {
      // Logout
      rl.close();
    }
  });
}

function findMatch(mode) {
  // finds an appropriate accounts for startMatch
}

function getStartAction(accounts, componentsDict) {
  // gets inputs for "startGame" in rules
  const action = {
    player1: accounts[0],
    player2: accounts[1],
    components: componentsDict
  }
  console.log("Accounts and components loaded.")
  return action;
}

async function getAndSubmitPlayerActions(boardState) {
  // gets inputs for playRound in rules
  // get choices from both players
  // ouputs action
  const hand = Object.keys(boardState.player1.hand);
  rl.question(`Enter your move choice (${hand}): `, (answer) => {
    const action = {
      player1: {
        playedComponent: answer
      },
      player2: {
        playedComponent: "Rock"
      }
    }
    console.log("Player actions received.")
    const result = rules.playRound(boardState, action);
    console.log(result);
    menu();
  });
}

function logMatch() {
  // add match to the mode and return the new leaderboard
}


// Game play loop:
/*
Ask client owner to log in
Ask if client owner would like to find a match
Match making: find a match that will satisfy the mode
  var startInputs = startGame([rsbAccount1, rsbAccount2], )
  repeat roShamBo(playerAction) until it returns a non-draw
Ask if you want to play again or log out
*/

async function playRoShamBo(accounts, componentsDict) {
  const startAction = getStartAction(accounts, componentsDict);
  const initBoardState = rules.startGame(startAction);
  const result = await getAndSubmitPlayerActions(initBoardState);
}

logInPrompt();
