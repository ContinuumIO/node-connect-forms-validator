
module.exports = form = {};

form.use = function(callback){
    if (typeof callback !== 'function') throw new Error("callback argument must be a function");
    this.stack.push(callback);
    return form;
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

for (var i in fields){
    var field = fields[i];
    form.use(field.process());
}

form.json = function(){

    return function jsonForm(req, res, next){

        form(req, res, function(err){
            if (err) return next(err);

            var ok = req.form.isValid(),
                status = ok? 200: 400
              ;
            res.status(status).json({ok: ok, errors: form.errors});
        });
    };
};
