
var Form = module.exports = function Form(body, csrfToken){
    this.rawData = body || {};
    this.data = {};
    this.fields = {};
    this.csrfToken = csrfToken || null;
    this.errors = {};
    this.types = {};

};

Form.prototype.addError =  function(key, message){

    if (this.errors[key] === undefined){this.errors[key] = [];}
    this.errors[key].push(message);
};

Form.prototype.isValid =  function(field){
    if (field){
        return !this.errors[field] || this.errors[field].length === 0;
    } else {
        return Object.keys(this.errors).length === 0;
    }

};

Form.prototype.hidden_tag =  function(){

    return '<input type="hidden" name="_csrf" value="' + this.csrfToken + '">'
};




var field = module.exports.field = function(key){
    return new Field(key);
};
