(function() {

  var game = {};

  game.init = function(){
    game.players = {};
    game.socket = io.connect('http://localhost:4002');

    game.canvas = document.getElementById("canvas");

    game.socket.on('connect', function(data){
      game.cell = (data != undefined) ? data.c : game.cell;
      game.line = (data != undefined) ? data.l : game.line;
      document.getElementById("canvas").width = (data != undefined) ? data.w : document.getElementById("canvas").width;
      document.getElementById("canvas").height= (data != undefined) ? data.h : document.getElementById("canvas").height;
    });

    game.socket.on('gameOver', function(data){
      alert(data.msg);
    });

    game.socket.on('draw', function(data){
      game.players = data.players;
    });

    game.ctx = game.canvas.getContext("2d");
    game.update();
  };

	game.drawRect = function(x,y,color){
	  game.ctx.beginPath();
	  game.ctx.rect(x ,y ,game.cell ,game.cell);
	  game.ctx.closePath();
	  game.ctx.fillStyle = color;
	  game.ctx.fill();
	};

  game.drawPlayers = function(){
    for(var i=0; i<game.players.length; i++){
      if(game.players[i].player.alive === true){
        for(var j=0; j<game.players[i].player.body.length; j++){
          game.drawRect(game.players[i].player.body[j].x*(game.line+game.cell)+(game.line/2), game.players[i].player.body[j].y*(game.line+game.cell)+(game.line/2), "#f00" );
        }
      }
      else{
        for(var j=0; j<game.players[i].player.body.length; j++){
          game.drawRect(game.players[i].player.body[j].x*(game.line+game.cell)+(game.line/2), game.players[i].player.body[j].y*(game.line+game.cell)+(game.line/2), "#fff" );
        }
      }
    }
  };

	game.drawBackground = function(){
	  canvas.width = canvas.width;
	  for(var i = -(game.line/2); i<canvas.width; i+=(game.cell+game.line)){
	  	for(var j = -(game.line/2); j<canvas.height; j+=(game.cell+game.line)){
	  	  game.drawRect(i+game.line, j+game.line, "#000");
	  	}
	  }
	};

  game.update = function(){
    game.drawBackground();
    game.drawPlayers();

    setTimeout(function(){return game.update()}, 100);
  }

  document.onkeydown = function(e){
    game.socket.emit("keyDown", {
      keyCode: e.keyCode
    });
  }

  game.init();
}).call(this);
