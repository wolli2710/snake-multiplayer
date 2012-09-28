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
  this.items = [];
  this.fieldWidth  = 0;
  this.fieldHeight = 0;

  var getFieldWidth = function(){
    return that.fieldWidth;
  };

  var getFieldHeight = function(){
    return that.fieldHeight;
  };

  var isGameOver = function(){
    var l = that.players.length;
    for(var i = 0; i< l; i++){
      var p = that.players[i].player;
      if(p.alive === false){
        if(p.gameOver === false){
          clients[that.players[i].id].emit('gameOver', {
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
      "players": that.players,
      "items": that.items
    });
    setTimeout(function(){that.gameLoop()}, 50);//player.getInterval());
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
    //init item
    var item = new obj.Item();
    that.items.push({"item":item});

    that.gameLoop();

    socket.on('keyDown', function(data){
      //bug ->build a separate data structure with all snakes...
      var player = {};
      for(var i = 0; i<that.players.length; i++){
        if(that.players[i].id === socket.id){
          player = that.players[i].player;
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


