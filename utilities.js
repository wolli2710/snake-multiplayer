function rand(min, max){
    min = min || 0;
    max = max || 1;

    return Math.random() * (max - min) + min;
};

exports.randInt = function(min, max){
    return Math.floor( rand( min, max ) );
};
