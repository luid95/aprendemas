'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_curso';

var compare = {};

//funcion comprobar los datos del token
compare.ensureAuth = (req, res, next) => {
    
    if(!req.headers.authorization){

        return res.status(403).send({message: 'La peticion no tiene la cabecera de autenticacion'});
    }

    //vamos a quitar las posibles comillas que pueda tener el token
    var token = req.headers.authorization.replace(/['"]+/g, '');

    //ahora vamos a decodificar el token
    try {
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){

            return res.status(401).send({message: 'El token ha expirado'});
        }

    } catch (ex) {
        console.log(ex);
        res.status(404).send({message: 'Token no valido'});
    }

    req.user = payload;

    next();
};

module.exports = compare;