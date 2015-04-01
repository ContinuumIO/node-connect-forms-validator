
module.exports = form = {};

form.use = function(callback){
    if (typeof callback !== 'function') throw new Error("callback argument must be a function");
    this.stack.push(callback);
    return this;
};

form.success = function(callback){

    this.stack.push(function(req, res, next){
        if (this.isValid()){
            callback(req, res, next);
        } else {
            next();
        }
    });
    return this;
};

form.failed = function(callback){

    this.stack.push(function(req, res, next){
        if (this.isValid()){
            next();
        } else {
            callback(req, res, next);
        }
    });
    return this;
};




form.flash = function(category){

    this.stack.push(function(req, res, next){
        for (key in req.form.errors){
            var errors = req.form.errors[key];
            for (i in errors){
                req.flash(category||'danger', errors[i]);
            }
        }
        next();
    });

    return this;
};

form.useAll = function(callbacks){
    for (var i in callbacks){
        var callback = callbacks[i];
        this.stack.push(callback);
    }
};

form.json = function(){
    this.stack.push(function(req, res, next){
        var ok = req.form.isValid(),
            status = ok? 200: 400
          ;
        res.status(status).json({ok: ok, errors: req.form.errors});
    });
};
