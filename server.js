(function() {
  var io = require('socket.io').listen(4000);
  var snake = require('./snake.js');
  var players = [];
  //canvas setup
  var canvasWidth = 300;
  var canvasHeight = 200;
  //field variables
  var cell = 8;
  var line = 2;
  //var fieldWidth = 0;
  //var fieldHeight = 0;
  var that = this;

  //save sockets per client
  var clients = [];

  this.fieldWidth  = 0;
  this.fieldHeight = 0;

  var getFieldWidth = function(){
    return that.fieldWidth;
  };

  var getFieldHeight = function(){
    return that.fieldHeight;
  };

  var isGameOver = function(){
    var l = players.length;
    for(var i = 0; i< l; i++){
      var p = players[i].player;
      if(p.alive === false){
        if(p.gameOver === false){
          clients[players[i].id].emit('gameOver', {
            msg: "You are Game Over"
          });
          p.gameOver = true;
        }
      }
    }
  }

  //gameLoop
  //bug
  this.gameLoop = function(){//player){
    isGameOver();

    //player.updatePosition();
    io.sockets.emit('draw', {
      "players": players
    });
    setTimeout(function(){that.gameLoop()}, 200);//player.getInterval());
  }

  //realtime server
  io.sockets.on('connection', function(socket) {
    var id = socket.id;
    canvasWidth += 20;
    canvasHeight += 20;
    that.fieldHeight = canvasHeight / (cell+line);
    that.fieldWidth  = canvasWidth / (cell+line);
    clients[socket.id] = socket;

    //grow canvas
    io.sockets.emit('connect', {
      c: cell,
      l: line,
      w: canvasWidth,
      h: canvasHeight
    });

    //init player
    var player = new snake.Snake( that );
    players.push({"id":id, "player":player});

    that.gameLoop();

    socket.on('keyDown', function(data){
      //bug ->build a separate data structure with all snakes...
      var player = {};
      for(var i = 0; i<players.length; i++){
        if(players[i].id === socket.id){
          player = players[i].player;
        }
      }

      //if keyCode is allowed change direction
      switch(data.keyCode){
        case 38:
          if(player.body[1].x !== player.body[0].x && player.body[1].y-1 !== player.body[0].y){
            player.setDirection("u");
          }
          break;
        case 40:
          if(player.body[1].x !== player.body[0].x && player.body[1].y+1 !== player.body[0].y){
            player.setDirection("d");
          }
          break;
        case 37:
          if(player.body[1].x-1 !== player.body[0].x && player.body[1].y !== player.body[0].y){
            player.setDirection("l");
          }
          break;
        case 39:
          if(player.body[1].x+1 !== player.body[0].x && player.body[1].y !== player.body[0].y){
            player.setDirection("r");
          }
          break;
      }
    });

    socket.on('disconnect', function(){
      console.log("disconnected " + socket.id);
    });

  });
}).call(this);
