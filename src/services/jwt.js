'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta_curso';

var token = {};

//funcion crear token
token.createToken = (user) => {
    
    //almacenaremos datos que tengan que ver con el usuario
    var payload = {
        sub: user._id, //guardar el id del usuario
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        lat: moment().unix(), //fecha de creacion de token
        exp: moment().add(30, 'days').unix //expiracion del token cada 30 dias
    }

    //codificamos o ciframos el payload, para crear el token
    //convirtiendo en un hash
    return jwt.encode(payload, secret)
};

module.exports = token;