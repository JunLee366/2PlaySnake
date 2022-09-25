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

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('player_id: ' + msg.player_id);
    console.log('keypress: ' + msg.key_val);
  });
});

module.exports = app;