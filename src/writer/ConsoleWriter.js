if(typeof module != "undefined" && module.exports){
    LogDomain = require("../LogDomain");
    isNodeJs = true;
}


function ConsoleWriter(){

    this.write = function(level, domain, msg){
        console.log("["+LogDomain.Log_Level_Name[level]+"] : "+(domain?"("+domain+") ":"")+msg);
    };
};



if(typeof module!="undefined" && module.exports){
    module.exports = ConsoleWriter;
}
