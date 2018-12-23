# smg-proof-of-concept

Proof of concept set match games system

## Parts of the system

### Gamerules

Base rules that don't change between each time a game is played

### Components

The cards or pices of a game that can change between each time a game is played

* Cards in MTG or Hearthstone
* Units in RTS
* Heroes and items in MOBAs

### Formats

Set of allowed components

### Modes

Rules for intrepreting game results

# Client

Execute gamerules, respecting formats and through the course of gameplay create results that can be understood by modes.
Brings everything needed to play a game together.

In this project, we are proving the concept with a simplified implementation.

```
Game:       Ro-sham-bo
Components: Rock, Paper, Scissors
Formats:    Standard (Rock, Paper, Scissors)
Modes:      Leaderboard
```
