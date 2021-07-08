'use strict'
const express = require('express')
const ligaController = require('../controllers/liga.controller')
const md_autenticacion = require('../middlewares/authenticated')

var api = express.Router()
api.get('/obtenerLigas', md_autenticacion.ensureAuth, ligaController.obtenerLigas)
api.post('/registrarLiga', md_autenticacion.ensureAuth, ligaController.registrarLiga)
api.put('/editarLiga/:idLiga', md_autenticacion.ensureAuth,ligaController.editarLiga)
api.delete('/eliminarLiga/:idLiga', md_autenticacion.ensureAuth,ligaController.eliminarLiga)
api.get('/obtenerLigaId/:idLiga',ligaController.obtenerLigaId)
api.get('/obtenerLigasAll', md_autenticacion.ensureAuth, ligaController.obtenerLigasAll)

module.exports = api