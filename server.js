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

  this.fieldWidth  = 0;
  this.fieldHeight = 0;

  var getFieldWidth = function(){
    return that.fieldWidth;
  };

  var getFieldHeight = function(){
    return that.fieldHeight;
  };

  //gameLoop
  var gameLoop = function(player){
    player.updatePosition();
    io.sockets.emit('draw', {
      "players": players
    });
    setTimeout(function(){gameLoop(player)}, player.getInterval());
  }

  //realtime server
  io.sockets.on('connection', function(socket) {
    var id = socket.id;
    canvasWidth += 20;
    canvasHeight += 20;
    that.fieldHeight = canvasHeight / (cell+line);
    that.fieldWidth  = canvasWidth / (cell+line);

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

    gameLoop(player);

    socket.on('keyDown', function(data){
      console.log(data.keyCode);

      switch(data.keyCode){
        case 38:
          if(that.body[1].x !== that.body[0].x && that.body[1].y-1 !== that.body[0].y){
            direction = "u";
          }
          break;
        case 40:
          if(that.body[1].x !== that.body[0].x && that.body[1].y+1 !== that.body[0].y){
            direction = "d";
          }
          break;
        case 37:
          if(that.body[1].x-1 !== that.body[0].x && that.body[1].y !== that.body[0].y){
            direction = "l";
          }
          break;
        case 39:
          if(that.body[1].x+1 !== that.body[0].x && that.body[1].y !== that.body[0].y){
            direction = "r";
          }
          break;
      }

    });

    socket.on('disconnect', function(){
      console.log("disconnected " + socket.id);
    });
  });
}).call(this);
