exports.Colorgenerator = function(){
  var that = this;
  this.arr = "#";

  this.initColor = function(){
    for(var i=0; i<6; i++){
      this.arr += Math.floor(Math.random()*(15-5)).toString(16);
    }
    return this.arr;
  }

  return this.initColor();;
}
