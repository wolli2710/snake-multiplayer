exports.Snake = function(server){

  //private variables
  var alive = true;
  var col = require('./colorgenerator.js');
  var util = require('./utilities.js');
  var that       = this;
  var direction  = "r";

  //public variables
  this.gameOver = false;
  this.interval = 500;
  this.color = new col.Colorgenerator();
  this.body = [];

  //private methods
  var init = function(length){
    that.body = [{x:util.randInt(5, server.fieldWidth-1), y: server.fieldHeight-1}]
    for(var i = 0; i<=length;i++){
      grow({x:that.body[0].x-i, y:that.body[0].y});
    }
    return that.body;
  }

  var getInterval = function(){
    return that.interval;
  };

	var getPosition = function(){
	  return that.body;
	};

	var getLength = function(){
	  return that.body.length-1;
	};

  var getDirection = function(l){
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
          setAlive(false);
          return 0;
        }
      }
    }
  }

  var setInterval = function(interv){
    that.interval = interv;
  }

	var grow = function(elem) {
	  that.body.push({x:elem.x, y:elem.y});
	};

  this.isAlive = function(){
    return (alive===true) ? true : false;
  }

  var setAlive = function(value){
    alive = value;
  };

  var itemCollision = function(l){
    var currentItem = isColliding(l);
    if(currentItem !== false){
      //item behavior
      switch(currentItem.type){
        case "s": setInterval(200);
                  currentItem.setNewPosition();
        break;
        case "f": grow(that.body[l-1]);
                  currentItem.setNewPosition();
        break;
        case "b": setInterval(800);
                  currentItem.setNewPosition();
        break;
        case "m": setAlive(false);
                  currentItem.setNewPosition();
        break;
      }
    }
  }

  var isColliding = function(){
    var si = server.items;
    for(var i = 0; i<si.length; i++){
      if(that.body[0].x === si[i].item.x && that.body[0].y === si[i].item.y){
          return si[i].item;
      }
    }
    return false;
  }


  init(4);
  setAlive(true);

  var updatePosition = function(){
    var l = that.body.length-1;
    if(that.isAlive()===true){
      itemCollision(l);
      getDirection(l);
    }
    setTimeout(function(){updatePosition()}, getInterval());
  };


  //public methods
  this.setDirection = function(dir){
    direction = dir;
  }

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


  //update Snake position
  updatePosition();

  return this;
}
