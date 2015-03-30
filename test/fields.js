var Field = require('../src/field');
var Form = require('../src/form');
var expect = require('chai').expect

describe('Field', function(){

    describe('#use #process', function(){
        it("should call the middleware when processing", function(done){
            var field = new Field("username")

            var signal = false;
            field.use(function(req, res, next){
                signal = true;
                next()
            });

            var middleware = field.process();
            var req = {form: {data: {}, rawData: {}}};
            var res = {locals: {}};
            middleware(req, res, function(){
                expect(signal).to.equal(true);
                done();
            });

        });


        it("should stop processing middleware on first error", function(done){
            var field = new Field("username")

            var signal = false;
            field.use(function(req, res, next){
                next("Error")
            }).use(function(req, res, next){
                signal = true;
                next()
            });

            var middleware = field.process();
            var req = {form: new Form()};
            var res = {locals: {}};
            middleware(req, res, function(){
                expect(signal).to.equal(false);
                done();
            });

        });

    });


    describe('#bool', function(){

        it("should default to false for empty values", function(done){
            var field = new Field("rememberMe")

            field.bool();

            var req = {form: new Form()};
            var res = {locals: {}};

            var middleware = field.process();

            middleware(req, res, function(){
                expect(req.form.data).to.deep.equal({rememberMe: false});
                done();
            });

        });

        it("should be true when field is not empty", function(done){
            var field = new Field("rememberMe")

            field.bool();

            var req = {form: new Form({rememberMe: 'on'})};
            var res = {locals: {}};

            var middleware = field.process();

            middleware(req, res, function(){
                expect(req.form.data).to.deep.equal({rememberMe: true});
                done();
            });

        });
    });


    describe('#trim', function(){

        it("should trim strings", function(done){
            var field = new Field("lol")

            field.trim();

            var req = {form: new Form({lol: " trim me "})};
            var res = {locals: {}};

            var middleware = field.process();

            middleware(req, res, function(){
                expect(req.form.data).to.deep.equal({lol: "trim me"});
                done();
            });

        });

    });


    describe('#required', function(){

        it("should flag an error when the field is not given", function(done){
            var field = new Field("username")

            field.required();

            var req = {form: new Form()};
            var res = {locals: {}};

            var middleware = field.process();

            middleware(req, res, function(){

                expect(req.form.isValid()).to.equal(false);
                done();
            });

        });

        it("Should be ok when not error", function(done){
            var field = new Field("username")

            field.required();

            var req = {form: new Form({username: 'bob'})};
            var res = {locals: {}};

            var middleware = field.process();

            middleware(req, res, function(){
                expect(req.form.isValid()).to.equal(true);
                done();
            });

        });

    });
});