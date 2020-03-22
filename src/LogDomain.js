const Log_Level = {
    DEBUG: 0,
    WARNING: 1,
    ERROR: 2,
    NONE: 3,
};


const Log_Level_Name = {
    0: "DEBUG",
    1: "WARNING",
    2: "ERROR"
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

    if(!level){
        if(parent){
            level = parent.getLevel();
        }else{
            level = Log_Level.DEBUG;
        }
    }else{

        if(typeof level == "string"){
            level = level.toUpperCase();
        }

        if(level in Log_Level){
            level = Log_Level[level];
        }else if(!(level in Log_Level_Name)){
            throw new Error("Invalid log level : "+level);
        }
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
        if (!(level in Log_Level)){
            return false;
        }

        var parent = domain.parent;
        while(parent){
            if(level < parent.level){
                return false;
            }
            parent = parent.getParent();
        }
        domain.level = level;
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
