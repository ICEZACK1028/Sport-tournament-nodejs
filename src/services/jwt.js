'use strict';

//Importaciones
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'secretPassword';

exports.createToken = function (user){
    var payload={
        sub: user._id,
        usuario: user.usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        direccion: user.direccion,
        telefono: user.telefono,
        correo: user.correo,
        rol: user.rol,
        imagen: user.imagen,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payload, secret);
}
