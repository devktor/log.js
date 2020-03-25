
function ConsoleWriter(){

    this.write = function(domain, event, msg){
        console.log("["+event+"] : "+(domain?"("+domain+") ":"")+(typeof msg=="string" ? msg: JSON.stringify(msg)));
    };
};



if(typeof module!="undefined" && module.exports){
    module.exports = ConsoleWriter;
}
