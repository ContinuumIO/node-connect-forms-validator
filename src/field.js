
var Field = module.exports = function(key){
    /* Field object has a middleware stack and can 'use' middleware itself
    */
    this.key = key;

    this.stack = [function field(req, res, next){
        var form = this;
        form.data[key] = form.rawData[key] || "";
        next();
    }];
};

Field.prototype.use = function(callback){
    /* Mounts the middleware function(s) to this field
    */
    if (typeof callback !== 'function') throw new Error("callback argument must be a function");
    var key = this.key;

    this.stack.push(function(req, res, next){
        callback.call(this, req, res, next, key, req.form.data[key]);
    });

    return this;
};


Field.prototype.process = function(){
    /* process the middleware stack */
    var field = this;

    return function(req, res, last){
        var stack = field.stack;
        var idx = 0;

        next = function (err){

            if (err){
                if (typeof err == 'string'){
                    req.form.addError(field.key, err);
                    return last();
                } else {
                    return last(err);
                }
            }

            middleware = stack[idx++];
            if (middleware === undefined){
                last();
            } else {
                middleware.call(req.form, req, res, next);
            }


        };

        next();
    };
};


Field.prototype.bool = function(){
    /* convert result into a bool value */
    var key = this.key;
    this.stack.push(function(req, res, next){
        this.data[key] = !!this.data[key];
        next();
    });

    return this;
};


Field.prototype.trim = function(){
    /* convert result into a bool value */
    var key = this.key;
    this.stack.push(function(req, res, next){
        this.data[key] = this.data[key].trim();
        next();
    });

    return this;
};


Field.prototype.required = function(message){
    /* require this field to exist */
    var key = this.key;
    this.stack.push(function required(req, res, next){

        var form = this;

        if (!form.data[key]){

            return next(message || "The " + key + " field can not be empty");
        }
        next();
    });

    return this;
};

Field.prototype.flash = function(){
    /* flash a message if the field has an error */
    var key = this.key;
    this.stack.push(function flash(req, res, next){

        if (!req.flash){
            return next(new Error("req.flsah middleware is required to use field.flash"));
        }

        var form = this;
        if (form.errors[key]){
            req.flash("error", form.errors[key].join(', '));
        }
        next();
    });

    return this;
};

Field.prototype.is = function(re, message){
    /* match the field value against a regular expression */
    var key = this.key;

    this.stack.push(function is(req, res, next){
        var form = this;
        if (! (form.data[key] || "").match(re)){
            return next(message || "The " + key + " field is invalid");
        }
        next();
    });

    return this;
};

Field.prototype.default = function(value) {
    /* Set a default value for this field */
    this.default_ = value;
    return this;

};
Field.prototype.choices = function(choices, message){
    /* Restrict this field to an array of choices */
    var key = this.key;

    this.stack.push(function(req, res, next){
        var form = this;
        if (choices.indexOf(form.data[key]) < 0){
            return next(key, message || key + " must be one of " + choices.join(', '));
        }
        next();
    });

    return this;

};


