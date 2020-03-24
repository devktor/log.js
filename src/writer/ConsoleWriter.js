if(typeof module != "undefined" && module.exports){
    LogDomain = require("../detail/LogDomain");
    isNodeJs = true;
}


function ConsoleWriter(){

    this.write = function(level, domain, msg){
        console.log("["+LogDomain.Log_Level_Name[level]+"] : "+(domain?"("+domain+") ":"")+(typeof msg=="string" ? msg: JSON.stringify(msg)));
    };
};



if(typeof module!="undefined" && module.exports){
    module.exports = ConsoleWriter;
}
