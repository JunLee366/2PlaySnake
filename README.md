# 2PlaySnake

### Team Members (2): Jun Ho Lee, David Wang
### Devpost link: https://devpost.com/software/two-player-snake-game

## Program and Libraries used
* Node.js
* Express.js
* EJS
* Socket.io

## What is 2PlaySnake
2PlaySnake is a web application that allows 2 players to play against each other

## How does it work?
### A] Lobby page
1. On server startup, the server waits for 2 players to join the game
2. When a user arrives to the Lobby page, they are presented with a button that represents what player they are
* When the 1st user comes in, the button will be labeled "player1"
* Once 1st user clicks on the button and 2nd user comes in, the button will be labeled "player2"
3. After 2 players clicked buttons, 3rd player and above will be blocked access because player limit is reached

### B] Game page
1. On start of the game, player 1 will be placed on the left side of the board,
player 2 will be placed on the right side of the board
2. Since this is a 2 player game for 2 different hosts, each player can control their snake and 
see the opponent snake. The server keeps track of user input and updates information to client
3. As the game progresses, the snakes gradually move faster and grow in size. This keeps going until one of the snakes bite another snake or bumps into a wall

## Getting Started
1. Node and npm should already be installed [nodemon is optional]
2. npm install at the top level of directory
3. npm run start to execute program
4. Test functionality of multiplayer by opening multiple browser and connecting to localhost:3000
