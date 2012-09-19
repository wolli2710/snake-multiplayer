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
  var fieldWidth = canvasWidth / (cell+line);
  var fieldHeight = canvasHeight / (cell+line);

  //realtime server
  io.sockets.on('connection', function(socket) {
    var id = socket.id;
    canvasWidth += 20;
    canvasHeight += 20;

    //grow canvas
    io.sockets.emit('connect', {
      c: cell,
      l: line,
      w: canvasWidth,
      h: canvasHeight
    });

    //init player
    var player = new snake.Snake();
    players.push({"id":id});
    console.log("connected " + players[0].id + " canvasWidth " + canvasWidth);

   //  //socket.on('drawClick', function(data) {
   //    socket.broadcast.emit('draw', {
   //      x: data.x,
   //      y: data.y,
   //      type: data.type
   //    });
   // // });

    socket.on('disconnect', function(){
      console.log("disconnected " + socket.id);
    });
  });
}).call(this);
