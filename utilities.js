function rand(min, max){
    min = min || 0;
    max = max || 1;

    return Math.random() * (max - min) + min;
};

exports.randInt = function(min, max){
    return Math.floor( rand( min, max ) );
};


//increase Array functionality
//check if snake crashes into own body
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

//check if snake collides with other snake or item
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
