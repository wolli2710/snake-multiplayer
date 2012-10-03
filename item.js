exports.Item = function(server){

  var that  = this;
  var types = ["f", "m", "s", "b"];
  var util = require('./utilities.js');

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
    that.x = util.randInt(0, server.fieldWidth-1)
    that.y = util.randInt(0, server.fieldHeight-1)
  }

  return this;
};
