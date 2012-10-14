(function() {

  var game = {};

  var socketConnectHandler = function(){
    game.socket.on('connect', function(data){
      game.cell = (data != undefined) ? data.c : game.cell;
      game.line = (data != undefined) ? data.l : game.line;
      document.getElementById("canvas").width = (data != undefined) ? data.w : document.getElementById("canvas").width;
      document.getElementById("canvas").height= (data != undefined) ? data.h : document.getElementById("canvas").height;
    });
  };

  var socketDrawHandler = function(){
    game.socket.on('draw', function(data){
      game.players = data.players;
      game.items = data.items;
    });
  };

  var socketGameOverHandler = function(){
    game.socket.on('gameOver', function(data){
      alert(data.msg);
    });
  }

  game.init = function(){
    game.players = {};
    game.items = {};
//    game.socket = io.connect('http://io.wolfgang-vogl.com:9000');
    game.socket = io.connect('http://localhost:9000');

    game.canvas = document.getElementById("canvas");

    socketConnectHandler();
    socketGameOverHandler();
    socketDrawHandler();

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
    var pl = game.players.length;
    for(var i=0; i<pl; i++){
      if(game.players[i].player.alive === true){
        var b = game.players[i].player.body;
        for(var j=0; j<b.length; j++){
          game.drawRect(b[j].x*(game.line+game.cell)+(game.line/2), b[j].y*(game.line+game.cell)+(game.line/2), game.players[i].player.color.arr);
        }
      }
      else{
        for(var j=0; j<game.players[i].player.body.length; j++){
          game.drawRect(game.players[i].player.body[j].x*(game.line+game.cell)+(game.line/2), game.players[i].player.body[j].y*(game.line+game.cell)+(game.line/2), "#fff" );
        }
      }
    }
  };

  game.drawItems = function(){
    var il = game.items.length;
    for(var i=0; i<il; i++){
      var item = game.items[i].item;
      var color = "#777";
      if(item.type === "s"){color = "#fff"}
      else if(item.type === "m"){color ="#f00";}
      else if(item.type === "b"){color="#ff0";}
      else if(item.type === "f"){color="#f0f";}
      game.drawRect(item.x*(game.line+game.cell)+(game.line/2), item.y*(game.line+game.cell)+(game.line/2), color);
    }
  }

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
    game.drawItems();

    setTimeout(function(){return game.update()}, 100);

    /* requestAnimationFrame(game.update); */

  }

  document.onkeydown = function(e){
    game.socket.emit("keyDown", {
      keyCode: e.keyCode
    });
  }

  game.init();
}).call(this);
