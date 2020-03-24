function TestWriter(){
    this.lastMessage = "";
    this.lastLevel = null;
    this.lastDomain = "";
    this.wrote = 0;

    this.write = function(level, domain, message){
        this.wrote++;
        this.lastLevel = level;
        this.lastDomain = domain;
        this.lastMessage = message;
    };
    return this;
}

if(typeof module != "undefined" && module.exports){
    module.exports = TestWriter;
}
