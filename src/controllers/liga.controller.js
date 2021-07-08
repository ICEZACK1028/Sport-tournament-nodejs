'use strict'
const ligaModel = require('../models/liga.model')

function obtenerLigas(req,res){
    var idUsuario = req.user.sub
    ligaModel.find({usuario:idUsuario},(err, ligasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: 'Error al leer las ligas' })
        if (!ligasEncontradas) return res.status(200).send({mensaje: 'Aún no se agregan ligas'})
        
        return res.status(200).send({ligasEncontradas})
    })
}

function registrarLiga(req,res){
    var ligaConstructor = new ligaModel()
    var params = req.body;
    var idUsuario = req.user.sub
    
    ligaConstructor.nombre = params.nombre;
    ligaConstructor.descripcion = params.descripcion;
    ligaConstructor.imagen = params.imagen;
    ligaConstructor.usuario = idUsuario;

    ligaModel.findOne({nombre: params.nombre, usuario: idUsuario},(err,ligaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error al guardar la liga' })
        if (ligaEncontrada) return res.status(500).send({mensaje: 'Está liga ya existe'})

        ligaConstructor.save((err, ligaGuardada) => {
            if (err) return res.status(500).send({ mensaje: 'Error al guardar la liga' })
            return res.status(200).send({ligaGuardada})
        })
    })
}

function editarLiga(req,res){
    var params = req.body
    var idLiga = req.params.idLiga

    ligaModel.findOneAndUpdate({_id: idLiga}, { nombre: params.nombre, descripcion: params.descripcion,imagen: params.imagen},
    {new: true, usuFindAndModify: false}, (err, ligaActualizada) => {
        if (err) return res.status(200).send({mensaje: 'Error al actualizar la liga'})

        return res.status(200).send({ligaActualizada})
    })
}

function eliminarLiga(req,res){
    var idLiga = req.params.idLiga

    ligaModel.findOneAndDelete({_id: idLiga},(err, ligaEliminada) => {
        if (err) return res.status(500).send({mensaje:'La liga no se ha eliminado'})

        return res.status(200).send({mensaje:'La liga se ha eliminado con éxito'})
    })
}

function obtenerLigaId(req,res){
    var idLiga = req.params.idLiga
    
    ligaModel.findById(idLiga, (err, ligaEncontrada) => {
        if (err) return res.status(500).send({mensaje: 'Error al obtener los datos'})
        if (!ligaEncontrada) return res.status(500).send({ mensaje: 'Error en obtener los datos' })

        return res.status(200).send({ ligaEncontrada })
    })
}

function obtenerLigasAll(req,res){
    var idUsuario = req.user.sub
    ligaModel.find().populate('usuario').exec((err, ligasEncontradas)=> {
        if (err) return res.status(500).send({ mensaje: 'Error al leer las ligas' })
        if (!ligasEncontradas) return res.status(200).send({mensaje: 'Aún no se agregan ligas'})
        
        return res.status(200).send({ligasEncontradas})
    })
}

module.exports = {
    obtenerLigas,
    registrarLiga,
    editarLiga,
    eliminarLiga,
    obtenerLigaId,
    obtenerLigasAll
}
