const mongoose = require("mongoose")
var Schema = mongoose.Schema;

var JornadaSchema = Schema({
    nombre: String,
    numero: Number,
    liga: { type: Schema.Types.ObjectId, ref: 'ligas'},
    games: [{
        equipo1: { type: Schema.Types.ObjectId, ref: 'equipo'},
        nombre1: String,
        imagen1: String,
        equipo2: { type: Schema.Types.ObjectId, ref: 'equipo'},
        nombre2: String,
        imagen2: String,
        goles1: Number,
        goles2: Number,
    }]
    
})

module.exports = mongoose.model('jornada', JornadaSchema);