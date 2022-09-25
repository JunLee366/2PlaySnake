var createError = require('http-errors');
var express = require('express');
var path = require('path');
const http = require('http');
var socketio = require('socket.io');

var indexRouter = require('./routes/index');

var app = express();
var server = http.createServer(app);
var io = socketio(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.PORT || '3000';
server.listen(port);

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// ========================================

// 1) game variables [server]
let steps = 0;
let celing_step = 5;
let increase_step = 5;

let boardWidth = 400;
let boardHeight = 400;

// 2) snake values [server]
let player1 = [
    {x: 100, y: 200},
    {x: 90, y: 200},
    {x: 80, y: 200},
    {x: 70, y: 200},
    {x: 60, y: 200}
  ];
let player2 = [
    {x: 300, y: 200},
    {x: 310, y: 200},
    {x: 320, y: 200},
    {x: 330, y: 200},
    {x: 340, y: 200}
  ];
let count = 0;

io.on('connection', (socket) => {
  if (count === 0){
    console.log('Player 1 connected');
    socket.emit('start game', {}); // send
    count++;
  }  else if (count === 1){
    console.log('Player 2 connected');
    count++;
    socket.emit('start game', {}); // send
  }  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('send move', (msg) => { // receive
    if (msg.id !== undefined){
      console.log("SERVER] send move");
      console.log('id: ' + msg.id + ' x: ' + msg.x + ' y: ' + msg.y);
      dx = msg.dx;
      dy = msg.dy;

      if (msg.id == 1){
        move_snake(player1, msg.id)
      } else if (msg.id == 2){
        move_snake(player2, msg.id)
      } 

      console.log("SERVER] get board");
      socket.emit('get board', {
        player1: player1,
        player2: player2,
        steps: Math.floor(steps/2),
        end: has_game_ended() // game over?
      }); // send
    }
  });
});

// ==========

function has_game_ended() {
  // if snake eats itself
  for (let i = 4; i < player1.length; i++) {
    if (player1[i].x === player1[0].x && player1[i].y === player1[0].y) return true
  }
  for (let i = 4; i < player2.length; i++) {
    if (player2[i].x === player2[0].x && player2[i].y === player2[0].y) return true
  }
  for (let i = 1; i < player2.length; i++) {
    if (player2[i].x === player1[0].x && player2[i].y === player1[0].y) return true
  }
  for (let i = 1; i < player1.length; i++) {
    if (player1[i].x === player2[0].x && player1[i].y === player2[0].y) return true
  }

  // if snake bumps into wall
  let hitLeftWall = player1[0].x < 0;
  let hitRightWall = player1[0].x > boardWidth - 10;
  let hitToptWall = player1[0].y < 0;
  let hitBottomWall = player1[0].y > boardHeight - 10;
  if (hitLeftWall || hitRightWall || hitToptWall || hitBottomWall){
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
  }

  hitLeftWall = player2[0].x < 0;
  hitRightWall = player2[0].x > boardWidth - 10;
  hitToptWall = player2[0].y < 0;
  hitBottomWall = player2[0].y > boardHeight - 10;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

function move_snake(snake, id) {
  // Create the new Snake's head
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  // Add the new head to the beginning of snake body
  snake.unshift(head);
  if (steps > celing_step) {
    // increment celing
    celing_step += increase_step;
  } else {
    // Remove the last part of snake body
    snake.pop();
  }

  if (id == 1){
    player1 = snake;
  } else if (id == 2){
    player2 = snake;
  }  
  steps += 1;
}


module.exports = app;