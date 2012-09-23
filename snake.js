exports.Snake = function(server){
  var that = this,
      direction = "r",
      interval = 800;

  this.init = function(){
    var startPoint = [{x:Math.floor(server.fieldWidth-server.fieldWidth/2), y:server.fieldHeight-1}]
    return startPoint;
  }

  this.getInterval = function(){
    return interval;
  };

  this.setInterval = function(interv){
    interval = interv;
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
	};

	this.isEating = function(obj){
	  var l = obj.body.length;
	  for(var i = 0; i<l; i++){
      if(that.body[0].x === obj.body[i].x && that.body[0].y === obj.body[i].y){
          return obj.body[i];
      }
	  }
	  return false;
	}

  this.body = this.init();
  for(var i =0; i<14;i++){
    this.grow({x:this.body[0].x-i, y:this.body[0].y});
  }
  this.alive = true;
  this.gameOver = false;

  this.updatePosition = function(){
	  var l = that.body.length-1;
    if(that.isAlive()){
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
  for(i=0; i<l; i++){
  	if(this[i].x === obj.x && this[i].y === obj.y){
  		counter++;
  	}
  }
  return (counter >= 2) ? 0 : 1;
}
