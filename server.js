(function() {
  var io = require('socket.io').listen(4002);
  var snake = require('./snake.js');
  var obj  = require('./item.js');
  //canvas setup
  var canvasWidth = 300;
  var canvasHeight = 200;
  //field variables
  var cell = 8;
  var line = 2;

  var that = this;

  //save sockets per client
  var clients = [];

  this.players = [];
  this.playersSocketSort = [];
  this.items = [];
  this.fieldWidth  = 0;
  this.fieldHeight = 0;

  var getFieldWidth = function(){
    return that.fieldWidth;
  };

  var getFieldHeight = function(){
    return that.fieldHeight;
  };

  var clear = function(){
    that.players = [];
    that.items = [];
  }

  var isGameOver = function(){
    var l = that.players.length;
    var deadCount = 0;
    for(var i = 0; i< l; i++){
      var p = that.players[i].player;
      if(p.alive === false){
        deadCount++;
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
    }
  }

  //gameLoop
  //bug
  this.gameLoop = function(){//player){
    isGameOver();

    //player.updatePosition();
    io.sockets.emit('draw', {
      "players": that.players,
      "items": that.items
    });
    setTimeout(function(){that.gameLoop()}, 70);//player.getInterval());
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
    that.players.push({"id":id, "player":player});
    //init player with socket id
    that.playersSocketSort[socket.id] = player;
    //init item
    var item = new obj.Item( that );
    that.items.push({"item":item});

    that.gameLoop();

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

    socket.on('disconnect', function(){
      console.log("disconnected " + socket.id);
    });

  });
}).call(this);
