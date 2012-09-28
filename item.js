exports.Item = function(){

  var that  = this,
      types = ["f", "m", "s", "b"];

  //type f = food / m = mine / s = speedup / b = breake
  this.type = "f"; // getType();

  this.x = 2;
  this.y = 2;

  this.getType = function(){
    var t = Math.floor(Math.random()* 3);
    return types[t];
  };

  this.getNewPosition = function(){
    that.type = that.getType();
    that.x = Math.floor(Math.random()* 8);
    that.y = Math.floor(Math.random()* 8);
  }

  return this;
};
