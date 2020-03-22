if (typeof module !== 'undefined' && module.exports) {
    assert = require("chai").assert;
    LogDomain = require("../src/LogDomain");
}else{
    var assert = chai.assert;
}


describe("LogDomain", function() {

    describe("#constructor()", function(){

        it("Log_Level as text", function(){
            var domain = new LogDomain("test", "warning");
            assert.equal(domain.getName(), "test");
            assert.equal(domain.getLevel(), LogDomain.Log_Level.WARNING);
        });

        it("Log_Level by value", function(){
            var domain = new LogDomain("test", LogDomain.Log_Level.WARNING);
            assert.equal(domain.getName(), "test");
            assert.equal(domain.getLevel(), LogDomain.Log_Level.WARNING);
        });

        it("parent linking", function(){
            var parent = new LogDomain("parent", "error");
            var domain = new LogDomain("test", "warning", parent);

            assert(parent.hasSubDomain("test"));
        });

        it("invalid log level value", function(){
            assert.throws(function(){
                var domain = new LogDomain("test", 43);
            });
        });

        it("invalid log level text", function(){
            assert.throws(function(){
                var domain = new LogDomain("test", "TEST");
            });
        });

        it("invalid name", function(){
            assert.throws(function (){
                var domain = new LogDomain("test:231", LogDomain.Log_Level.DEBUG);
            });
        });

        it("invalid parent", function(){
            assert.throws(function(){
                var domain = new LogDomain("test", LogDomain.Log_Level.DEBUG, "asdasd");
            });
        });

    });

    describe("#getName()", function(){
        it("domain name", function(){
            var domain = new LogDomain("test", "WARNING");
            assert.equal(domain.getName(), "test");
        });
    });


    describe("#getLevel()", function(){
        it("level", function(){
            var domain = new LogDomain("test", "error");
            assert.equal(domain.getLevel(), LogDomain.Log_Level.ERROR);
        });
    });


    describe("#getParent()", function(){

        it("parent", function(){
            var parent = new LogDomain("parent", "warning");
            var domain = new LogDomain("test", "debug", parent);
            assert.equal(domain.getParent().getName(), "parent");
            assert.equal(domain.getParent().getLevel(), LogDomain.Log_Level.WARNING);
            assert(domain.getParent().hasSubDomain("test"));
        });
    });

    describe("#replaceSubDomainByUri()", function(){
        it("new subdomain", function(){
            var parent = new LogDomain("parent");
            var domain = parent.replaceSubDomainByUri("test", "warning");
            assert(parent.hasSubDomain("test"));
            assert.equal(domain.getParent().getName(), "parent");
            assert.equal(domain.getName(), "test");
            assert.equal(domain.getLevel(), LogDomain.Log_Level.WARNING);
        });

        it("existing subdomain", function(){
            var parent = new LogDomain("parent");
            parent.replaceSubDomainByUri("test", "warning");
            parent.replaceSubDomainByUri("test", "debug");
            
            assert(parent.hasSubDomain("test"));
            assert.equal(parent.getSubDomain("test").getLevel(), LogDomain.Log_Level.DEBUG);
        });

        it("new subdomain branch", function(){
            var parent = new LogDomain("parent");
            parent.replaceSubDomainByUri("foo:bar", "warning");
            assert(parent.hasSubDomain("foo"));
            var foo = parent.getSubDomain("foo");
            assert.equal(foo.getParent().getName(), "parent");
            assert(foo.hasSubDomain("bar"));
            assert.equal(foo.getName(), "foo");
            assert.equal(foo.getLevel(), LogDomain.Log_Level.WARNING);
            var bar = foo.getSubDomain("bar");
            assert(bar.getParent().getName(), "foo");
            assert.equal(bar.getName(), "bar");
            assert.equal(bar.getLevel(), LogDomain.Log_Level.WARNING);
        });
    })

    describe("#addSubDomainByUri()", function(){

        it("new subdomain", function(){
            var parent = new LogDomain("parent");
            var domain = parent.addSubDomainByUri("test", "warning");
            assert(parent.hasSubDomain("test"));
            assert.equal(domain.getParent().getName(), "parent");
            assert.equal(domain.getName(), "test");
            assert.equal(domain.getLevel(), LogDomain.Log_Level.WARNING);
        });

        it("existing subdomain", function(){
            var parent = new LogDomain("parent");
            var domain = parent.addSubDomainByUri("test", "warning");
            assert.equal(parent.addSubDomainByUri("test", "debug"), false);
            assert.equal(parent.getSubDomain("test").getLevel(), LogDomain.Log_Level.WARNING);
        });

        it("new subdomain branch", function(){
            var parent = new LogDomain("parent");
            parent.addSubDomainByUri("foo:bar", "warning");
            assert(parent.hasSubDomain("foo"));
            assert(parent.getSubDomain("foo").hasSubDomain("bar"));
        });

    });


    describe("#getSubDomain()", function(){

        it("existing subdomain", function(){
            var parent  = new LogDomain("parent");
            parent.addSubDomainByUri("foo", "warning");
            var domain = parent.getSubDomain("foo");
            assert.equal(domain.getName(), "foo");
        });

        it("undefined subdomain", function(){
            var parent = new LogDomain("parent");
            assert.equal(parent.getSubDomain("foo"), undefined);
        });
    });

    describe("#hasSubDomain()", function(){
        it("existing subdomain", function(){
            var parent  = new LogDomain("parent");
            parent.addSubDomainByUri("foo");
            assert(parent.hasSubDomain("foo"));
        });

        it("non existing subdomain", function(){
            var parent  = new LogDomain("parent");
            assert.equal(parent.hasSubDomain("foo"), false);
        });
    });

    describe("#findSubDomainByUri()", function(){
        it("existing subdomain", function(){
            var parent  = new LogDomain("parent");
            parent.addSubDomainByUri("foo");
            var foo = parent.findSubDomainByUri("foo");
            assert.notEqual(foo, undefined);
            assert.equal(foo.getName(), "foo");
        });
        it("subdomain of subdomain", function(){
            var parent = new LogDomain("parent");
            parent.addSubDomainByUri("foo:bar");
            var bar = parent.findSubDomainByUri("foo:bar");
            assert.notEqual(bar, undefined);
            assert.equal(bar.getName(), "bar");
        });
        it("undefined subdomain", function(){
            var parent = new LogDomain("parent");
            assert.equal(parent.findSubDomainByUri("foo:bar"), undefined);
            assert.equal(parent.findSubDomainByUri("foo"), undefined);
        });
    });

    describe("#setLevel()", function(){
        it("new log level", function(){
            var domain = new LogDomain("test", "debug");
            domain.setLevel("warning");
            assert.equal(domain.getLevel(), LogDomain.Log_Level.WARNING);
        });
        it("ivnalid value", function(){
            var domain = new LogDomain("test", "debug");
            assert.throws(function(){
                domain.setLevel("test");
            });
        });
    });



    describe("#getPtr()", function(){
        it("undefined ptr", function(){
            var domain = new LogDomain("foo");
            assert.equal(domain.getPtr(), null);
        });
        it("assigned ptr", function(){
            var obj = {data: "bar"};
            var domain = new LogDomain("foo", "warning", undefined, obj);
            assert(typeof domain.getPtr() == "object");
            assert(domain.getPtr().data, "bar");
        });
    });

    describe("#setPtr()", function(){
        it("new ptr", function(){
            var obj = {data: "bar"};
            var domain = new LogDomain("foo");
            domain.setPtr(obj);
            assert(typeof domain.getPtr() == "object");
            assert(domain.getPtr().data, "bar");
        });
        it("replace ptr", function(){
            var obj = {data: "bar"};
            var obj2 = {data: "bar2"};
            var domain = new LogDomain("foo", "warning", undefined, obj);
            domain.setPtr(obj2);
            assert(typeof domain.getPtr() == "object");
            assert(domain.getPtr().data, "bar2");
        });
    });
});


