if(typeof module != "undefined" && module.exports){
    Logger = require("./Logger");
}



function LogManager(domain){

    var context = new Logger.Context();
    var domain = new Logger.Domain(domain);
    var defaultLevel = null;

    this.setWriter = function(writer){
        context.setWriter(writer);
    };
    
    this.setDefaultLogLevel = function(level){
        defaultLevel = level;
    };

    this.getLogger = function(uri, level){
        var subdomain = domain.findSubDomainByUri(uri);
        if(subdomain){
            return subdomain.getPtr();
        }

        var logLevel = level? level: (defaultLevel?defaultLevel: domain.getLevel());
        subdomain = domain.addSubDomainByUri(uri, logLevel);

        //create parent loggers if needed
        var parent = subdomain.getParent();
        while(parent.getParent() && !parent.getPtr()){
            var parentLogger = new Logger(parent, context);
//            parent.setPtr(parentLogger);
            parent = parent.getParent();
        }

        return new Logger(subdomain, context);
    };


    this.setLogLevel = function(uri, level){
        var subdomain = domain.findSubDomainByUri(uri);
        if(subdomain){
            subdomain.getPtr().setLogLevel(level);
            return true;
        }
        return false;
    };

    this.mute = function(uri){
        return this.setLogLevel(uri, Logger.Log_Level.NONE);
    };

    return this;
}



if(typeof module != "undefined" && module.exports){
    module.exports = LogManager;
}
