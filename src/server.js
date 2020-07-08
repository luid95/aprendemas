'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//Carga de rutas
var user_routes = require('./routes/User');

//configuracion de puerto
app.set('port', process.env.PORT || 3000);

//convertir en json los datos recibidos mediante las peticiones http
//Parsear el body usando body parser
app.use(bodyParser.json()); // body en formato json
app.use(bodyParser.urlencoded({ extended: false })); //body formulario
//debe ejecutarse antes de las rutas

//rutas base
app.use('/api', user_routes);

//configuracion de cabeceras http


//rutas base

module.exports = app;