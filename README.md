# smg-proof-of-concept

Proof of concept set match games system

## Parts of the system

### Gamerules

Base rules that don't change between each time a game is played.

Pragmatically this is a protocol with a reference implementation in a client
(below) that uses components (below) for vairation in game setup.

### Components

The cards or pices of a game that can change between each time a game is played.

* Cards in MTG or Hearthstone
* Units in RTS
* Heroes and items in MOBAs
* Pices in chess
* Rock, Paper, and Scissors in Ro-sham-bo

### Formats

A specific set of components for a given set of gamerules make up a format.

**for Magic**
* Standard: All cards from the most recent magic sets, except for a specific
  banned list
* Modern: All cards since the addition of the new card frame, except for a
  specific banned list

**for Ro-sham-bo**
* Standard: Rock, Paper, Scissors
* Lizard Spock: Rock, Paper, Scissors, Lizard, Spock


### Modes

Rules for intrepreting game results within a specific set of gamerules and
format

# Client

Execute gamerules, respecting formats and through the course of gameplay create
results that can be understood by modes. Brings everything needed to play a game
together.

In this project, we are proving the concept with a simplified implementation.

```
Game:       Ro-sham-bo
Components: Rock, Paper, Scissors
Formats:    Standard (Rock, Paper, Scissors)
Modes:      Leaderboard
```
