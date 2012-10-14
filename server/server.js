(function() {
  //private variables
  var io = require('socket.io').listen(9000);
  var snake = require('./snake.js');
  var obj  = require('./item.js');
  //field variables
  var cell = 8;
  var line = 2;
  var that = this;
  //save sockets per client
  var clients = [];


  //public variables
  this.players = [];
  this.playersSocketSort = [];
  this.items = [];
  this.fieldWidth  = 0;
  this.fieldHeight = 0;
  //canvas setup
  this.canvasWidth = 300;
  this.canvasHeight = 200;


  //private methods
  var getFieldWidth = function(){
    return that.fieldWidth;
  };

  var getFieldHeight = function(){
    return that.fieldHeight;
  };

  var initFieldSize = function(){
    that.canvasWidth = 300;
    that.canvasHeight = 200;
  }

  var clear = function(){
    that.players = [];
    that.items = [];
  }

  var growField = function(){
    var increase = (cell+line)*2;
    that.canvasWidth += increase;
    that.canvasHeight += increase;
    that.fieldHeight = that.canvasHeight / (cell+line);
    that.fieldWidth  = that.canvasWidth / (cell+line);
  }

  var keyDownHandler = function(socket){
    socket.on('keyDown', function(data){
      var currentPlayer = that.playersSocketSort[socket.id];
      //if direction is allowed change direction
      switch(data.keyCode){
        case 38:
          if(currentPlayer.body[1].x !== currentPlayer.body[0].x && currentPlayer.body[1].y-1 !== currentPlayer.body[0].y){
            currentPlayer.setDirection("u");
          }
          break;
        case 40:
          if(currentPlayer.body[1].x !== currentPlayer.body[0].x && currentPlayer.body[1].y+1 !== currentPlayer.body[0].y){
            currentPlayer.setDirection("d");
          }
          break;
        case 37:
          if(currentPlayer.body[1].x-1 !== currentPlayer.body[0].x && currentPlayer.body[1].y !== currentPlayer.body[0].y){
            currentPlayer.setDirection("l");
          }
          break;
        case 39:
          if(currentPlayer.body[1].x+1 !== currentPlayer.body[0].x && currentPlayer.body[1].y !== currentPlayer.body[0].y){
            currentPlayer.setDirection("r");
          }
          break;
      }
    });
  }

  var socketConnectHandler = function(socket){
    io.sockets.emit('connect', {
      c: cell, l: line, w: that.canvasWidth, h: that.canvasHeight
    });
  }

  var socketDisconnectHandler = function(socket){
    socket.on('disconnect', function(){
      console.log("disconnected " + socket.id);
    });
  }

  var isGameOver = function(){
    var l = that.players.length;
    var deadCount = 0;
    for(var i = 0; i< l; i++){
      var p = that.players[i].player;
      if(p.isAlive() === false){
        deadCount++;
        //send Game Over notification once
        if(p.gameOver === false){
          clients[that.players[i].id].emit('gameOver', {
            msg: "You are Game Over"
          });
          p.gameOver = true;
        }
      }
    }
    if(deadCount === that.players.length){
      clear();
      initFieldSize();
    }
  }

  //gameLoop
  var gameLoop = function(){
    isGameOver();
    //player.updatePosition();
    io.sockets.emit('draw', {
      "players": that.players,
      "items": that.items
    });
    setTimeout(function(){gameLoop()}, 70);
  }

  //realtime server
  io.sockets.on('connection', function(socket) {
    var id = socket.id;
    growField();
    clients[socket.id] = socket;
    //send new size of canvas on client connect
    socketConnectHandler(socket);
    //init player
    var player = new snake.Snake( that );
    that.players.push({"id":id, "player":player});
    //init player with socket id
    that.playersSocketSort[socket.id] = player;
    //init item
    var item = new obj.Item( that );
    that.items.push({"item":item});
    gameLoop();
    keyDownHandler(socket);
    socketDisconnectHandler(socket);
  });
}).call(this);
