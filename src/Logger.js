if(typeof module != "undefined" && module.exports){

    LogDomain = require("./detail/LogDomain");
    ConsoleWriter = require("./writer/ConsoleWriter");
}



function LogContext(writer){
    this.writer = writer || new ConsoleWriter;

    this.setWriter = function(writer){
        if(!writer || !writer.write){
            throw new Error("Invalid writer");
        }
        this.writer = writer;
    };

    return this;
}



function Logger(domain, context){


    if(!domain){
        domain = new LogDomain("");
    }else{
        if(typeof domain == "string"){
            domain = new LogDomain(domain);
        }else{
            if(!LogDomain.Validate(domain)){
                throw new Error("Invalid log domain");
            }
        }
    }

    domain.setPtr(this);

    if(!context){
        context = new LogContext();
    }else{
        if(!(context instanceof LogContext)){
            throw new Error("Invalid log context");
        }
    }

    this.setLogLevel = function(level){
        return domain.setLevel(level);
    };

    this.getLogLevel = function(){
        return domain.getLevel();
    };

    this.mute = function(){
        this.setLogLevel(LogDomain.Log_Level.NONE);
    };

    this.getDomainName = function(){
        return domain.getName();
    };

    this.createChild = function(name, level){
        var subdomain = domain.addSubDomain(name, level);
        if(!subdomain){
            throw new Error("Invalid subdomain name or it already is registered");
        }
        return new Logger(subdomain, context);
    };

    this.getChild = function(name){
        var subdomain = domain.getSubDomain(name);
        if(!subdomain){
            return undefined;
        }
        return subdomain.getPtr();
    };

    this.getParent = function(){
        var parent = domain.getParent();
        if(parent){
            return parent.getPtr();
        }
        return undefined;
    };

    var log = function(level, event, msg){

        if(level < domain.getLevel()){
            return false;
        }
        var parent = domain;
    
        while(parent = parent.getParent()){
            if(level < parent.getLevel()){
                return false;
            }
        }

        var domainTxt = domain.getName();
        parent = domain.getParent();
        if(parent){
            domainTxt = parent.getName();
            while(parent = parent.getParent()){
                domainTxt = parent.getName() + ":" + domainTxt;
            }
        }
        context.writer.write(domainTxt, event, msg);
    };

    this.debug = function(msg){
        log(LogDomain.Log_Level.DEBUG, "DEBUG", msg);
    };

    this.error = function(msg){
        log(LogDomain.Log_Level.ERROR, "ERROR", msg);
    };

    this.warning = function(msg){
        log(LogDomain.Log_Level.WARNING, "WARNING", msg);
    };

    this.event = function(event, msg){
        log(LogDomain.Log_Level.EVENT, event, msg);
    };
};


Logger.Context = LogContext;
Logger.Domain = LogDomain;
Logger.Log_Level = LogDomain.Log_Level;
Logger.Log_Level_Name = LogDomain.Log_Level_Name;

if(typeof module != "undefined" && module.exports){

    module.exports = Logger;

}




