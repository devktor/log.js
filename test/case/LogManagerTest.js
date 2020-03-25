if(typeof module != "undefined" && module.exports){
    LogManager = require("../src/LogManager");
    assert = require("chai").assert;
}else{
    assert = chai.assert;
}

describe("LogManager", function(){

    describe("#getLogger()", function(){
        it("new logger", function(){
            var manager = new LogManager();
            var logger = manager.getLogger("test");
            assert.equal(logger.getDomainName(), "test");
            assert.equal(logger.getLogLevel(), Logger.Log_Level.DEBUG);
        });
        it("exiting logger", function(){
            var manager = new LogManager();
            var logger = manager.getLogger("test");
            logger.setLogLevel("error");
            logger = manager.getLogger("test");
            assert.equal(logger.getDomainName(), "test");
            assert.equal(logger.getLogLevel(), Logger.Log_Level.ERROR);
        });
        it("new child logger", function(){
            var manager = new LogManager();
            var parent = manager.getLogger("test");
            var child = manager.getLogger("test:test-child");
            assert.equal(child.getDomainName(), "test-child");
            child.setLogLevel("error");
            child = parent.getChild("test-child");
            assert.equal(child.getLogLevel(), Logger.Log_Level.ERROR);
        });
        it("new child and parent logger", function(){
            var manager = new LogManager();
            var child = manager.getLogger("test:test-child");
            assert.equal(child.getDomainName(), "test-child");
            assert.equal(child.getParent().getDomainName(), "test");
        });

        it("with root domain name", function(){
            var manager = new LogManager("root");
            var logger = manager.getLogger("test");
            var writer = new TestWriter();
            manager.setWriter(writer);
            logger.debug("test");
            assert.equal(writer.lastDomain, "root:test");
        });

    });
    describe("#setWriter()", function(){
        it("new writer", function(){
            var manager = new LogManager();
            var logger = manager.getLogger("test");
            var writer = new TestWriter();
            manager.setWriter(writer);
            logger.debug("test");
            assert.equal(writer.wrote, 1);
        });
        it("invalid writer", function(){
            var manager = new LogManager();
            assert.throws(function(){
                manager.setWriter(function(){});
            });
            assert.throws(function(){
                manager.setWriter();
            });
        });
    });
    describe("#setLogLevel()", function(){
        it("new log level", function(){
            var manager = new LogManager();
            var writer = new TestWriter();
            manager.setWriter(writer);
            var logger = manager.getLogger("test");
            logger.debug("test message");
            assert.equal(writer.wrote, 1);
            manager.setLogLevel("test", "error");
            logger.debug("test message 2");
            assert.equal(writer.wrote, 1);
        });
        it("child log level", function(){
            var manager = new LogManager();
            var writer = new TestWriter();
            manager.setWriter(writer);
            var logger = manager.getLogger("parent:child");
            manager.setLogLevel("parent:child", "error");
            logger.debug("test message 2");
            assert.equal(writer.wrote, 0);
        });
        it("invalid domain", function(){
            var manager = new LogManager();
            assert.isNotOk(manager.setLogLevel("test", "debug"));
        });
        it("invalid log level", function(){
            var manager = new LogManager();
            var child = manager.getLogger("test");
            assert.throws(function(){
                manager.setLogLevel("test", "sdadvsb");
            });
        });
    });
    describe("#mute()", function(){
        it("mute logger", function(){
            var manager = new LogManager();
            var writer = new TestWriter();
            manager.setWriter(writer);
            var logger = manager.getLogger("test");
            logger.debug("test message");
            assert.equal(writer.wrote, 1);
            manager.mute("test");
            logger.debug("test message 2");
            assert.equal(writer.wrote, 1);
        });
        it("mute parent logger", function(){
            var manager = new LogManager();
            var writer = new TestWriter();
            manager.setWriter(writer);
            var logger = manager.getLogger("parent:child");
            manager.mute("parent");
            logger.debug("test message 2");
            assert.equal(writer.wrote, 0);
        });
    });
});
