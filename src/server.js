'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//Carga de rutas
var user_routes = require('./routes/User');
var school_routes = require('./routes/School');
var grade_routes = require('./routes/Grade');
var subject_routes = require('./routes/Subject');
var task_routes = require('./routes/Task');

//configuracion de puerto
app.set('port', process.env.PORT || 3001);

//convertir en json los datos recibidos mediante las peticiones http
//Parsear el body usando body parser
app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: false })); //body formulario
//debe ejecutarse antes de las rutas

//configuracion de cabeceras http
app.use( (req, res, next) => {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-KEY, Access-Control-Allow-Request-Method');
  // allowed XHR methods
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');  
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');

  next();
});

//rutas base
app.use('/api', user_routes);
app.use('/api', school_routes);
app.use('/api', grade_routes);
app.use('/api', subject_routes);
app.use('/api', task_routes);

module.exports = app;