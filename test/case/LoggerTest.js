if(typeof module != "undefined" && module.exports){
    Logger = require("../src/Logger");
    assert = require("chai").assert;
}else{
    assert = chai.assert;
}


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


describe("Logger", function(){

    describe("#constructor()", function(){
        it("defaults", function(){
            assert.doesNotThrow(function(){
                var logger = new Logger();
            });
        });
        it("custom log domain", function(){
            var writer = new TestWriter();
            var logger = new Logger("test", new LogContext(writer));
            logger.debug("test message");
            assert.equal(writer.wrote, 1);
            assert.equal(writer.lastLevel, Logger.Domain.Log_Level.DEBUG);
            assert.equal(writer.lastDomain, "test");
            assert.equal(writer.lastMessage, "test message");
        });
        it("invalid log domain", function(){
            assert.throws(function(){
                var logger = new Logger("test:12");
            });

            assert.throws(function(){
                var logger = new Logger(function(){});
            })
        });
        it("existing context", function(){
            var writer = new TestWriter();
            var context = new LogContext(writer)
            var logger1 = new Logger("test", context);
            var logger2 = new Logger("test2", context);
            logger1.debug("test message");
            logger2.debug("test message 2");
            assert.equal(writer.wrote, 2);
        });
        it("invalid context", function(){
            assert.throws(function(){
                var logger = new Logger("", {test:1});
            });
        });
    });

    describe("#setLogLevel()", function(){
        it("new log level", function(){
            var logger = new Logger();
            assert.equal(logger.getLogLevel(), Logger.Log_Level.DEBUG);
            logger.setLogLevel("warning");
            assert.equal(logger.getLogLevel(), Logger.Log_Level.WARNING);
        });
    });

    describe("#createChild()", function(){
        it("default level", function(){
            var logger = new Logger();
            logger.setLogLevel("warning");
            var child = logger.createChild("test");
            assert.equal(child.getLogLevel(), Logger.Log_Level.WARNING);
            assert.equal(child.getDomainName(), "test");
        });
        it("custom level", function(){
            var logger = new Logger();
            logger.setLogLevel("debug");
            var child = logger.createChild("test", "warning");
            assert.equal(child.getLogLevel(), Logger.Log_Level.WARNING);
            assert.equal(child.getDomainName(), "test");
        });
        it("existing name", function(){
            var logger = new Logger();
            var child = logger.createChild("test");
            assert.throws(function(){
                logger.createChild("test");
            });
        });
        it("higher log level than parent", function(){
            var writer = new TestWriter;
            var logger = new Logger("", new LogContext(writer));
            logger.setLogLevel("error");
            var child = logger.createChild("test", "debug");
            child.debug("test");
            assert.equal(child.getLogLevel(), Logger.Log_Level.DEBUG);
            assert.equal(writer.wrote, 0);
        });
    });

    describe("#getChild()", function(){
        it("existing child", function(){
            var logger = new Logger();
            logger.setLogLevel("warning");
            logger.createChild("test");
            var child = logger.getChild("test");
            assert.equal(child.getDomainName(), "test");
            assert.equal(child.getLogLevel(), Logger.Log_Level.WARNING)
        });
        it("non-existing child", function(){
            var logger = new Logger();
            var child = logger.getChild("test");
            assert.equal(child, undefined);
        });
    });

    describe("#debug()", function(){
        it("debug log level", function(){
            var writer = new TestWriter();
            var logger = new Logger("",new LogContext(writer));
            logger.debug("test message");
            assert.equal(writer.wrote, 1);
            assert.equal(writer.lastLevel, Logger.Log_Level.DEBUG);
            assert.equal(writer.lastMessage, "test message");
        });
        it("lower log level", function(){
            var writer = new TestWriter();
            var logger = new Logger("",new LogContext(writer));
            logger.setLogLevel("warning");
            logger.debug("test message");
            assert.equal(writer.wrote, 0);
        });
        it("parent with lower log level", function(){
            var writer = new TestWriter();
            var logger = new Logger("",new LogContext(writer));
            logger.setLogLevel("warning");
            var child = logger.createChild("test", "debug");
            child.debug("test message");
            assert.equal(writer.wrote, 0);
        });
        
    });

    describe("#error()", function(){
        it("error level or higher", function(){
            var writer = new TestWriter();
            var logger = new Logger("",new LogContext(writer));
            logger.error("test message");
            assert.equal(writer.wrote, 1);
            assert.equal(writer.lastLevel, Logger.Log_Level.ERROR);
            assert.equal(writer.lastMessage, "test message");
        });
        it("lower log level", function(){
            var writer = new TestWriter();
            var logger = new Logger("",new LogContext(writer));
            logger.setLogLevel(Logger.Log_Level.NONE);
            logger.error("test message");
            assert.equal(writer.wrote, 0);
        });
        it("parent with lower log level", function(){
            var writer = new TestWriter();
            var logger = new Logger("",new LogContext(writer));
            logger.setLogLevel(Logger.Log_Level.NONE);
            var child = logger.createChild("test", "error");
            child.error("test message");
            assert.equal(writer.wrote, 0);
        });
    });

    describe("#warning()", function(){
        it("warning log level or higher", function(){
            var writer = new TestWriter();
            var logger = new Logger("",new LogContext(writer));
            logger.warning("test message");
            assert.equal(writer.wrote, 1);
            assert.equal(writer.lastLevel, Logger.Log_Level.WARNING);
            assert.equal(writer.lastMessage, "test message");
        });
        it("lower log level", function(){
            var writer = new TestWriter();
            var logger = new Logger("",new LogContext(writer));
            logger.setLogLevel(Logger.Log_Level.ERROR);
            logger.warning("test message");
            assert.equal(writer.wrote, 0);
        });
        it("parent with lower log level", function(){
            var writer = new TestWriter();
            var logger = new Logger("",new LogContext(writer));
            logger.setLogLevel(Logger.Log_Level.ERROR);
            var child = logger.createChild("test", "warning");
            child.warning("test message");
            assert.equal(writer.wrote, 0);
        });

    });


});
