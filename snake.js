

exports.Snake = function(server){
  var color = require('./colorgenerator.js');
  var that = this,
      direction = "r";

      this.interval = 800;
      this.col = new color.Colorgenerator();

  this.init = function(){
    console.log(that.col.initColor());
    var startPoint = [{x:Math.floor(server.fieldWidth-server.fieldWidth/2), y:server.fieldHeight-1}]
    return startPoint;
  }

  this.getInterval = function(){
    return that.interval;
  };

  this.setInterval = function(interv){
    that.interval = interv;
  }

	this.getPosition = function(){
	  return that.body;
	};

	this.getLength = function(){
	  return that.body.length-1;
	};

	this.grow = function(elem) {
	  that.body.push({x:elem.x, y:elem.y});
	};

  this.isAlive = function(){
    return that.alive === true;
  };

	this.isColliding = function(i){
	  if((that.body[i].x ) >= server.fieldWidth || (that.body[i].x ) < 0 || (that.body[i].y) >= server.fieldHeight|| (that.body[i].y ) < 0){
	  	return 1;
	  }
	  if(that.body.isUnique(that.body[i]) === 0){
	  	return 1;
	  }
    if(that.body.collision(server.players) === 0){
      return 1;
    }
	};

	this.isEating = function(){
	  var si = server.items;
	  for(var i = 0; i<si.length; i++){
      if(that.body[0].x === si[i].item.x && that.body[0].y === si[i].item.y){
          return si[i].item;
      }
	  }
	  return false;
	}

  this.body = this.init();
  for(var i =0; i<4;i++){
    this.grow({x:this.body[0].x-i, y:this.body[0].y});
  }
  this.alive = true;
  this.gameOver = false;

  this.updatePosition = function(){
	  var l = that.body.length-1;
    if(that.isAlive()){


          var currentItem = that.isEating();
          if(currentItem !== false){
            //build rules
            //if mine game over ...
            switch(currentItem.type){
              case "s": that.setInterval(200);
              break;
              case "f": that.grow(that.body[l-1]);
                        currentItem.getNewPosition();
              break;
              case "b": that.setInterval(800);
              break;
              case "m": that.alive = false;
              break;
            }
          }


      for(var i = l; i>=0; i--){
        if(i>0){
          that.body[i].x = that.body[i-1].x;
          that.body[i].y = that.body[i-1].y;
        }
        else{
          if(direction === "r"){ that.body[i].x = that.body[i].x + 1; }
          if(direction === "l"){ that.body[i].x = that.body[i].x - 1; }
          if(direction === "u"){ that.body[i].y = that.body[i].y - 1; }
          if(direction === "d"){ that.body[i].y = that.body[i].y + 1; }
          if(that.isColliding(i) === 1){
            console.log("GAME OVER");
            that.alive = false;
            return 0;
          }
        }
      }
    }
    setTimeout(function(){that.updatePosition()}, that.getInterval());
	};

  this.setDirection = function(dir){
    direction = dir;
  }

  this.getDirection = function(){
    return direction;
  }

  this.updatePosition();

  return this;
}


Array.prototype.isUnique = function(obj){
  var l = this.length,
  counter = 0;
  for(var i=0; i<l; i++){
  	if(this[i].x === obj.x && this[i].y === obj.y){
  		counter++;
  	}
  }
  return (counter >= 2) ? 0 : 1;
}

Array.prototype.collision = function(obj){
  var l = obj.length;
  for(var i=0; i<l; i++){
    var bdy = obj[i].player.body
    if(bdy !== this){
      var str = JSON.stringify(bdy);
      if(str.indexOf(JSON.stringify(this[0])) !== -1){
        return 0;
      }
    }
  }
  return 1;
}
