var extend = require('util')._extend;
var Field = require('./src/field');
var Form = require('./src/form');
var formTemplate = require('./src/form-template');

module.exports = function(){

    var fields = arguments;
    var connectForm;

    var default_values = {};

    connectForm = function(req, res, last){


        var idx = 0;
        var stack = connectForm.stack;

        var body = extend({}, default_values);
        extend(body, req.query);
        extend(body, req.body);

        var csrf = req.csrfToken && req.csrfToken();
        req.form = res.locals.form = new Form(body, csrf);

        // Don't perform form operaions on these methods
        if (["GET", "HEAD", "OPTIONS"].indexOf(req.method) >= 0){
            return last();
        }

        var next = function(err){

            if (err){
                return last(err);
            }

            middleware = stack[idx++];
            if (middleware === undefined){
                res.statusCode = 400;
                return last();
            } else {
                middleware.call(req.form, req, res, next);
            }
        };

        next();

    };

    connectForm.stack = [];
    extend(connectForm, formTemplate);

    for (var i in fields){
        var field = fields[i];
        if (field.default_){
            default_values[field.key] = field.default_;
        }
    }

    for (var i in fields){
        var field = fields[i];
        connectForm.use(field.process());
    }


    return connectForm;
};


module.exports.field = function(fieldName){return new Field(fieldName);};
module.exports.Field = Field;
module.exports.Form = Form;


