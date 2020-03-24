if(typeof module != "undefined" && module.exports){

    LogDomain = require("detail/LogDomain");
    ConsoleWriter = require("writer/ConsoleWriter");
}



function LogContext(writer){
    this.writer = writer || new ConsoleWriter;
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

    var log = function(level, msg){

        if(level < domain.getLevel()){
            return false;
        }
        var parent = domain;
    
        while(parent = parent.getParent()){
            if(level < parent.getLevel()){
                return false;
            }
        }

        var domainTxt = "";
        parent = domain.getParent();
        if(parent){
            domainTxt = parent.getName();
            while(parent = parent.getParent()){
                domainTxt = parent.getName() + ":" + domainTxt;
            }
        }
        context.writer.write(level, domain.getName(), msg);
    };

    this.debug = function(msg){
        log(Log_Level.DEBUG, msg);
    };

    this.error = function(msg){
        log(Log_Level.ERROR, msg);
    };

    this.warning = function(msg){
        log(Log_Level.WARNING, msg);
    };

};


Logger.Context = LogContext;
Logger.Domain = LogDomain;
Logger.Log_Level = LogDomain.Log_Level;
Logger.Log_Level_Name = LogDomain.Log_Level_Name;

if(typeof module != "undefined" && module.exports){

    module.exports = Logger;

}




