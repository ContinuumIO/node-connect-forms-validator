# Connect form middleware

## Quickstart

### Install
```sh
npm install --save connect-forms-validator
```

### Usage

```js
var formMiddleware = require('connect-forms-validator');

someForm = formMiddleware(
  form.field("username").required()
);

app.any('/login', someForm, function(req, res){

  if (req.form.isValid()){
  	// process req.form.data
  }
  res.render('login.html');

});

```


# API

## Form Middleware

The form middleware is the main entrypoint to the **connect-forms-validator** package.

```
var formMiddleware = require('connect-forms-validator');
```

### `formMiddleware(field, [, fields, ...])`

The form middleware accepts a variable number of fields as a constructor

### `formMiddleware.use(callback)`

Mount middleware to this form like `express.Router`.
Unlike the Router `formMiddleware.use` only takes one callback argument.

### `formMiddleware.success(callback)`

Mount middleware to this form. The `success` middleware will only be called when a non `GET,HEAD,OPTIONS` method is used and all of the field validators pass.

### `formMiddleware.flash(category='danger')`

Flash an error message if any of the fields are invalid.

## Form Object

Form objects are set on the req oject by the form middleware.

```js
req.form
```

### `Form.data`

The modified field data that has been sanitied by field middleware

### `Form.rawData`

The unmodified field data

### `Form.errors`

An object that contains `{fieldname: [errorMessage, ... ]}` entries

### `Form.isValid()`

Returns true if form.errors is not empty

### `Form.addError(key, message)`

Returns true if `form.errors` is not empty


## Fields


The `Field` object has a middleware stack and can 'use' middleware itself

Fields can be accessed from the main form template

```
var form = require('connect-forms-validator');
var field = form.field;
```


```js

var form.field("username").trim().use(function(req, res, next, keyname, value){
})

```

### `field.use(callback)`

#### `callback`

A function with the signature `callback(req, res, next, key, value)`

If next is called with a string,
the middleware processing will stop for this field and  `form.addError(key, message)` will be called.


### `field.bool()`

Ensure the field is a boolean value

### `field.trim()`

Call string trim method on the value

### `field.required([message])`

Flag an error if the field is not given

### `field.flash()`

Flash error if the field has an error

### `field.is(re [, message])`

Match the field value against a regular expression

### `field.default(value)`

Set the default value for this field

### `choices = function(choices [, message])`

Restrict this field to an array of choices




