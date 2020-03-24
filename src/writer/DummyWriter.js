

function DummyWriter(){
    this.write = function(){};
}


if(typeof module != "undefined" && module.exports){
    module.exports = DummyWriter;
}
