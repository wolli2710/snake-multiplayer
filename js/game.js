(function() {

  var game = {};

  game.init = function(){
    game.socket = io.connect('http://localhost:4000');


    game.canvas = document.getElementById("canvas");

    game.socket.on('connect', function(data){
      game.cell = data.c;
      game.line = data.l;
      document.getElementById("canvas").width = data.w;
      document.getElementById("canvas").height = data.h;
    });

    game.socket.on('draw', function(data){
      return game.draw(data.obj, data.x, data.y);
    });


    game.draw = function(obj, x, y){

    }

    game.ctx = game.canvas.getContext("2d");
    game.update();
  };

	game.drawRect = function(x,y,color){
	  game.ctx.beginPath();
	  game.ctx.rect(x ,y ,game.cell ,game.cell);
	  game.ctx.closePath();
	  game.ctx.fillStyle = color;
	  game.ctx.fill();
	}

	game.drawBackground = function(){
	  canvas.width = canvas.width;
	  for(var i = -(game.line/2); i<canvas.width; i+=(game.cell+game.line)){
	  	for(var j = -(game.line/2); j<canvas.height; j+=(game.cell+game.line)){
	  	  game.drawRect(i+game.line, j+game.line, "#000");
	  	}
	  }
	}


  game.update = function(){
    game.drawBackground();

    setTimeout(function(){return game.update()}, 100);
  }


  $(function(){
    return game.init();
  });

}).call(this);

