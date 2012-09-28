exports.Colorgenerator = function(){
  var that = this;

  this.initColor = function(){
    var arr = "#";
    for(var i=0; i<3; i++){
      arr += Math.floor(Math.random()*(15-0)).toString(16);
    }
    return arr;
  }
}
