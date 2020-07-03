'use strict'

const express = require('express');
const bodyParser = require('body-parser');

var app = express();

//setting
app.set('port', process.env.PORT || 3000);

//routes
app.get('/pruebas', (req, res) => {
    res.send('Hello World!');
});

//convertir en json los datos recibidos mediante las peticiones http
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//configuracion de cabeceras http


//rutas base

module.exports = app;