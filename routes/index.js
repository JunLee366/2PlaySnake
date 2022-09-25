var express = require('express');
var router = express.Router();

let players = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
      id: players + 1
  });
});

router.post('/', function(req, res, next) {
  players += 1;
  console.log(players);
  // await for players
  if (players <= 2) {
    let id = req.body.id;
    console.log(id);
    res.render('play', { player_id: players });
  }
})

router.get('/play', function(req, res, next) {
  
})

module.exports = router;
