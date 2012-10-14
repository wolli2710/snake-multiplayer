exports.Item = function(server){

  //private variables
  var that  = this;
  var types = ["f", "m", "s", "b"];
  var util  = require('./utilities.js');

  //public variables
  this.x = 0;
  this.y = 0;

  var getType = function(){
    var t = util.randInt(0, 3);
    return types[t];
  };

  this.setNewPosition = function(){
    that.type = getType();
    that.x = util.randInt(0, server.fieldWidth-1);
    that.y = util.randInt(0, server.fieldHeight-1);
  };

  //type f = food / m = mine / s = speedup / b = brake
  this.type = getType();
  this.setNewPosition();

  return this;
};
