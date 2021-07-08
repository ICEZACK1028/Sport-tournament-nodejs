'use strict'
const app = require('./app');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')
const Usuario = require('./src/models/usuario.model')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://admin:admin@cluster0.9tm3d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {

    console.log('Conectado a la base de datos Sport Tournament');
    app.listen(process.env.PORT || 3000, function() {
        console.log('Se encuentra corriendo en el puerto 3000');

        var usuarioModel = new Usuario()
        usuarioModel.usuario = "ADMIN"
        var secret = 'deportes123'
        usuarioModel.nombre = "ADMIN";
        usuarioModel.apellido = "";
        usuarioModel.direccion = "ADMIN";
        usuarioModel.telefono = "N/A";
        usuarioModel.correo = "ADMIN";
        usuarioModel.imagen = "https://static.vecteezy.com/system/resources/previews/000/436/896/non_2x/vector-key-icon.jpg";
        usuarioModel.rol = 'ROL_ADMIN'

        Usuario.find({ usuario: usuarioModel.usuario }).exec((err, usuarioEncontrado) => {
            if (usuarioEncontrado && usuarioEncontrado.length >= 1) {
                return console.log('El usuario Administrador ya fue creado');
            } else {
                bcrypt.hash(secret, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;
                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error al guardar usuario' })
                        if (usuarioGuardado) {
                            return console.log(usuarioGuardado);
                        } else {
                            return console.log('No se ha podido guardar el usuario');
                        }
                    })
                })
            }
        })
    })

}).catch(err => console.log(err))
