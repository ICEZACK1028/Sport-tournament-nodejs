'use strict'

//Importaciones
const usuarioModel = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

//Funciones

//FUNCIÓN PARA REGISTRAR UN USUARIO
function registrarUsuario (req,res){
    var usuarioConstructor = new usuarioModel();
    var params = req.body;

    usuarioConstructor.usuario = params.usuario;
    usuarioConstructor.nombre = params.nombre;
    usuarioConstructor.apellido = params.apellido;
    usuarioConstructor.direccion = params.direccion;
    usuarioConstructor.telefono = params.telefono;
    usuarioConstructor.correo = params.correo;
    usuarioConstructor.imagen = params.imagen;
    usuarioConstructor.rol = 'ROL_USUARIO';

    usuarioModel.find({ usuario: usuarioConstructor.usuario }).exec((err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Ha surgido un error' });

        if(usuarioEncontrado && usuarioEncontrado.length >= 1){
            return res.status(500).send({ 
                mensaje: `El usuario '${params.user}' ya está en uso. Prueba con otro` 
            });
        }else{
            bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                usuarioConstructor.password = passwordEncriptada;

                usuarioConstructor.save((err, usuarioGuardado )=>{
                    if(usuarioGuardado){
                        return res.status(200).send({ usuarioGuardado });
                    }else{
                        return res.status(500).send({ 
                            mensaje: 'No se ha podido registrar el usuario, inténtalo de nuevo' 
                        });
                    };
                });
            });
        };
    });
}

//FUNCIÓN PARA AGREGAR UN USUARIO ADMINISTRADOR
function registrarAdmin (req,res){
    var usuarioConstructor = new usuarioModel();
    var params = req.body;

    usuarioConstructor.usuario = params.usuario;
    usuarioConstructor.nombre = params.nombre;
    usuarioConstructor.apellido = params.apellido;
    usuarioConstructor.direccion = params.direccion;
    usuarioConstructor.telefono = params.telefono;
    usuarioConstructor.correo = params.correo;
    usuarioConstructor.imagen = params.imagen;
    usuarioConstructor.rol = 'ROL_ADMIN';

    usuarioModel.find({ usuario: usuarioConstructor.usuario }).exec((err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Ha surgido un error' });

        if(usuarioEncontrado && usuarioEncontrado.length >= 1){
            return res.status(500).send({ 
                mensaje: `El usuario '${params.user}' ya está en uso. Prueba con otro` 
            });
        }else{
            bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                usuarioConstructor.password = passwordEncriptada;

                usuarioConstructor.save((err, usuarioGuardado )=>{
                    if(usuarioGuardado){
                        return res.status(200).send({ usuarioGuardado });
                    }else{
                        return res.status(500).send({ 
                            mensaje: 'No se ha podido registrar el usuario, inténtalo de nuevo' 
                        });
                    };
                });
            });
        };
    });
}

//FUNCIÓN PARA CONVERTIR A UN USUARIO ADMINISTRADOR
function agregarAdministrador (req,res){
    var idUsuario = req.params.idUsuario;
    
    usuarioModel.findOneAndUpdate({ _id: idUsuario, rol: 'ROL_USUARIO' }, { rol: 'ROL_ADMINISTRADOR' }, {new: true, useFindAndModify: false }, (err, nuevoAdmin)=>{
        if(err) return res.status(500).send({ mensaje: 'Ha ocurrido un error' });
        if(!nuevoAdmin) return res.status(500).send({ mensaje: 'No se ha encontrado este usuario y / o este usuario es administrador' });

        return res.status(200).send({ nuevoAdmin });
    });
}

//FUNCIÓN PARA EDITAR UN USUARIO
function editarUsuario (req,res){
    var idUsuario = req.params.idUsuario;
    var params = req.body;

    //buscamos y actualizamos el usuario
    usuarioModel.findOneAndUpdate({ _id: idUsuario, rol: 'ROL_USUARIO' }, {usuario: params.usuario, 
        nombre: params.nombre, 
        apellido: params.apellido,
        direccion: params.direccion,
        telefono: params.telefono,
        correo: params.correo,
        rol: params.rol,
        imagen: params.imagen
        },{new: true, useFindAndModify: false},(err, usuarioActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'Vaya... ha saltado un error'});
        if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha encontrado este usuario y / o este usuario es administrador'});
    
        return res.status(200).send({ usuarioActualizado });
    });
}

//FUNCIÓN PARA EDITAR UN USUARIO
function editarPerfil (req,res){
    var idUsuario = req.user.sub;
    var params = req.body;

    //buscamos y actualizamos el usuario
    usuarioModel.findOneAndUpdate({ _id: idUsuario}, {usuario: params.usuario, 
        nombre: params.nombre, 
        apellido: params.apellido,
        direccion: params.direccion,
        telefono: params.telefono,
        correo: params.correo,
        rol: params.rol,
        imagen: params.imagen
        },{new: true, useFindAndModify: false},(err, usuarioActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'Vaya... ha saltado un error'});
        if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se ha encontrado este usuario y / o este usuario es administrador'});
    
        return res.status(200).send({ usuarioActualizado });
    });
}

//FUNCIÓN PARA ELIMINAR UN USUARIO
function eliminarUsuario(req,res){
    var idUsuario = req.params.idUsuario;

    //buscamos y eliminamos por medio del ID 
    usuarioModel.findByIdAndDelete({ _id: idUsuario, rol:'ROL_USUARIO'}, (err, usuarioEliminado)=>{
        if(err) return  res.status(500).send({ mensaje: 'Nos hemos topado con un error' });
        if(!usuarioEliminado) return res.status(500).send({ mensaje: 'No se ha encontrado este usuario y / o este usuario es administrador'});
    
        return res.status(200).send({ usuarioEliminado });
    });
}

//FUNCIÓN PARA ELIMINAR UN USUARIO
function eliminarPerfil(req,res){
    var idUsuario = req.params.idUsuario;

    //buscamos y eliminamos por medio del ID 
    usuarioModel.findByIdAndDelete({ _id: idUsuario}, (err, usuarioEliminado)=>{
        if(err) return  res.status(500).send({ mensaje: 'Nos hemos topado con un error' });
        if(!usuarioEliminado) return res.status(500).send({ mensaje: 'No se ha encontrado este usuario y / o este usuario es administrador'});
    
        return res.status(200).send({ usuarioEliminado });
    });
}

//FUNCIÓN PARA LISTAR USUARIOS
function listarUsuarios(req,res){
    
    usuarioModel.find((err, usuariosListados)=>{
        if(err) return res.status(500).send({ mensaje: 'Ha surgido un error brother' });
        if(!usuariosListados) return res.status(500).send({ mensaje: 'No se han encontrado usuarios' });

        return res.status(200).send({ usuariosListados });
    })
}

//FUNCIÓN PARA VISUALIZAR UN USUARIO 
function verUsuario(req,res){
    var idUsuario = req.params.idUsuario;

    //buscamos el usuario por id y lo mostramos
    usuarioModel.findById({ _id: idUsuario, rol:'ROL_USUARIO'}, (err, verUsuario)=>{
        if(err) return res.status(500).send({ mensaje: 'Ha ocurrido un error brother' });
        if(!verUsuario) return res.status(500).send({ mensaje: 'No se ha encontrado el usuario o es administrador'});

        return res.status(200).send({ verUsuario });
    })
}

//FUNCIÓN PARA VISUALIZAR UN USUARIO 
function verUsuarioLogueado(req,res){
    var idUsuario = req.user.sub;

    //buscamos el usuario por id y lo mostramos
    usuarioModel.findById({ _id: idUsuario}, (err, verUsuario)=>{
        if(err) return res.status(500).send({ mensaje: 'Ha ocurrido un error brother' });
        if(!verUsuario) return res.status(500).send({ mensaje: 'No se ha encontrado el usuario o es administrador'});

        return res.status(200).send({ verUsuario });
    })
}

//FUNCIÓN PARA INICIAR SESIÓN
function login(req, res) {
    var params = req.body;
    usuarioModel.findOne({ usuario: params.usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de usuario Usuario' });
        if (usuarioEncontrado) {
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrecta) => {
                if (passCorrecta) {
                    if (params.obtenerToken === 'true') {
                        return res.status(200).send({ token: jwt.createToken(usuarioEncontrado) });
                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuarioEncontrado })
                    }
                } else {
                    return res.status(401).send({ mensaje: 'El usuario no se ha podido identificar' })
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'Error al obtener usuario' });
        }
    })
    
}

//EXPORTACIÓN DE FUNCIONES
module.exports = {
    registrarUsuario,
    agregarAdministrador,
    login,
    editarUsuario,
    eliminarUsuario,
    verUsuario,
    listarUsuarios,
    registrarAdmin,
    editarPerfil,
    eliminarPerfil,
    verUsuarioLogueado
}