function TestWriter(){
    this.lastMessage = "";
    this.lastEvent = "";
    this.lastDomain = "";
    this.wrote = 0;

    this.write = function(domain, event, message){
        this.wrote++;
        this.lastEvent = event;
        this.lastDomain = domain;
        this.lastMessage = message;
    };
    return this;
}

if(typeof module != "undefined" && module.exports){
    module.exports = TestWriter;
}
