'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EquipoSchema = Schema({
    nombre: String,
    imagen: String,
    PJ: Number,
    PG: Number,
    PP: Number,
    PE: Number,
    GF: Number,
    GC: Number,
    DG: Number,
    PT: Number,
    ligaID: {type: Schema.Types.ObjectId, ref: 'ligas'}
});
module.exports = mongoose.model('equipo', EquipoSchema);