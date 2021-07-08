const mongoose = require("mongoose")
var Schema = mongoose.Schema;

var LigaSchema = Schema({
    nombre: String,
    descripcion: String,
    imagen: String,
    usuario: { type: Schema.Types.ObjectId, ref: 'usuarios'}
})

module.exports = mongoose.model('ligas', LigaSchema);