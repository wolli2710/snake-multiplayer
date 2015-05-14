exports.Colorgenerator = function(){
  var that = this;
  var util = require('./utilities.js');
  this.arr = "#";

  this.initColor = function(){
    for(var i=0; i<6; i++){
      this.arr += util.randInt(6, 15).toString(16);
    }
    return this.arr;
  }

  return this.initColor();;
}
