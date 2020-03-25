const Log_Level = {
    DEBUG: 0,
    EVENT: 1,
    WARNING: 2,
    ERROR: 3,
    NONE: 4,
};


const Log_Level_Name = {
    0: "DEBUG",
    1: "EVENT",
    2: "WARNING",
    3: "ERROR",
    4: "NONE"
};


function ValidateDomainName(name){
    if(name.includes(":")){
        return false;
    }
    return true;
}


function LogDomain(name, level, parent, ptr){

    if(!name){
        name = "";
    }else{
        if(!ValidateDomainName(name)){
            throw new Error("Invalid log domain name");
        }
    }

    if(parent){

        if(!(parent instanceof LogDomain)){
            throw new Error("Invalid parent");
        }
        parent.setSubdomain(name, this);
    }

    var parseLogLevel = function(level){
        if(typeof level == "string"){
            level = level.toUpperCase();
        }

        if(level in Log_Level){
            level = Log_Level[level];
        }else if(!(level in Log_Level_Name)){
            throw new Error("Invalid log level : "+level);
        }
        return level;
    };

    if(!level){
        if(parent){
            level = parent.getLevel();
        }else{
            level = Log_Level.DEBUG;
        }
    }else{

        level = parseLogLevel(level);
    }


    var domain = {
        name: name,
        parent: parent,
        subdomains: {},
        level: level,
        ptr: ptr||null
    };




    this.getName = function(){
        return domain.name;
    };

    this.getLevel = function(){
        return domain.level;
    };

    this.getParent = function(){
        return domain.parent;
    };

    this.addSubDomain = function(name, level, ptr){
        if(this.hasSubDomain(name)){
            return false;
        }
        return this.replaceSubDomain(name, level, ptr);
    };

    this.replaceSubDomain = function(name, level, ptr){
        if(!ValidateDomainName(name)){
            //not allowing multiple subdomains
            return false;
        }
        return new LogDomain(name, level, this, ptr);
    };

    this.addSubDomainByUri = function(uri, level, ptr){
        var subdomain = this.findSubDomainByUri(uri);
        if(subdomain){
            return false;
        }
        return this.replaceSubDomainByUri(uri, level, ptr);
    };

    this.replaceSubDomainByUri = function(uri, level, ptr){

        var nodes = uri.split(":");
        var name = nodes.pop();
        var parent = this;

        for(var i in nodes){
            if(parent.hasSubDomain(nodes[i])){
                parent = parent.getSubDomain(nodes[i]);
            }else{
                //creating if doesn't exists
                parent = new LogDomain(nodes[i], level, parent);
            }
        }

        var subdomain = new LogDomain(name, level, parent, ptr);
        return subdomain;
    };

    this.setSubdomain = function(name, subdomain){
        domain.subdomains[name] = subdomain;
    };

    this.getSubDomain = function(name){
        return domain.subdomains[name];
    };

    this.hasSubDomain = function(name){
        return domain.subdomains[name] != undefined;
    };

    this.findSubDomainByUri = function(path){

        if(typeof path == "array"){
            names = path;
        }else{
            names = path.split(":");
        }

        var node = this;
        for(var i in names){
            node = node.getSubDomain(names[i]);
            if(!node) break;
        }
        return node;
    };


    this.setLevel = function(level){
        domain.level = parseLogLevel(level);
        return true;
    };

    this.getPtr = function(){
        return domain.ptr;
    };

    this.setPtr = function(ptr){
        domain.ptr = ptr;
    };

    return this;
}


LogDomain.Log_Level = Log_Level;
LogDomain.Log_Level_Name = Log_Level_Name;
LogDomain.ValidateName = ValidateDomainName;

LogDomain.Validate = function (domain){
    return domain instanceof LogDomain;
}



if(typeof module != "undefined" && module.exports){

    module.exports = LogDomain;
}
