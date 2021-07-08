'use strict'
const jornadaModel = require('../models/jornada.model');
const equipoModel = require('../models/equipo.model');

function iniciarLiga(req, res) {
    var ligaId = req.params.ligaId;
    var equipo1
    var equipo2
    var juegos
    var juegosNombres
    var rondas
    var goles
    var imagenes

    equipoModel.find({ ligaID: ligaId }, (err, equiposEncontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Ha ocurrido un error' });
        if (!equiposEncontrados) return res.status(500).send({ mensaje: 'No se han encontrado equipos' });

        var numEquipos = equiposEncontrados.length
        var numJornadas = equiposEncontrados.length - 1;
        var numPartidoPorJornada = (equiposEncontrados.length / 2);
        
        rondas = create2DArray(numJornadas,numPartidoPorJornada)
        juegos = create2DArray(numJornadas,numPartidoPorJornada)
        juegosNombres = create2DArray(numJornadas,numPartidoPorJornada)
        goles = create2DArray(numJornadas,numPartidoPorJornada)
        imagenes = create2DArray(numEquipos,numPartidoPorJornada)

//---------------------------------FASE 1---------------------------------//
        for (let i = 0, k = 0; i < numJornadas; i ++){
            for (let j = 0; j < numPartidoPorJornada; j ++){
                var stringTemporal = String(k)
                rondas[i][j] = stringTemporal
                juegos[i][j] = equiposEncontrados[k]._id
                juegosNombres[i][j] = equiposEncontrados[k].nombre
                goles[i][j] = Math.round(Math.random()*5)
                imagenes[i][j] = equiposEncontrados[k].imagen

                k ++;
                if (k == numJornadas)
                    k = 0;
            }
        }

        // console.log(rondas);
        console.log(goles);
//---------------------------------FASE 2---------------------------------//
        for (let i = 0; i < numJornadas; i ++){
            var stringTemporal2 = rondas[i][0] + " - " + String(numEquipos -1)
            rondas[i][0]= stringTemporal2;
            juegos[i][0] = juegos[i][0] + " - " + equiposEncontrados[numEquipos-1]._id 
            juegosNombres[i][0] = juegosNombres[i][0] + " - " + equiposEncontrados[numEquipos-1].nombre
            goles[i][0] = goles[i][0] + " - " + Math.round(Math.random()*5)
            imagenes[i][0] = imagenes[i][0] + equiposEncontrados[numEquipos-1].imagen
       }
    //    console.log(rondas);
       console.log(goles);
//---------------------------------FASE 3---------------------------------//

       var equipoMasAlto = numEquipos - 1;
       var equipoImparMasAlto = equipoMasAlto - 1; 

       for (let i = 0, k = equipoImparMasAlto; i < numJornadas; i ++){
           for (let j = 1; j < numPartidoPorJornada; j ++){

                let stringTemporal = String(k)
                rondas[i][j] =  rondas [i][j] +' - '+ stringTemporal
                juegos[i][j] =  juegos [i][j] +' - '+ equiposEncontrados[k]._id
                juegosNombres[i][j] =  juegosNombres [i][j] +' - '+ equiposEncontrados[k].nombre
                goles[i][j] =  goles [i][j] +' - '+ Math.round(Math.random()*5)
                imagenes[i][j] =  imagenes [i][j] + equiposEncontrados[k].imagen

               k --;
               if (k == -1)
                   k = equipoImparMasAlto;
           }
       }
    //    console.log(rondas);

console.log(goles);
//---------------------------------FASE 4---------------------------------//

       for (let i = 0, k = 0; i < numJornadas; i ++){
        for (let j = 0; j < numPartidoPorJornada; j ++){

            var stringTemporal = String(k)
            var equiposNombre = juegosNombres[i][j]
            var nombre1 = equiposNombre.split(' - ')[0]
            var nombre2Array = equiposNombre.split(' - ')
            var nombre2 = nombre2Array[nombre2Array.length - 1]

            var equipos = juegos[i][j]
            equipo1 = equipos.split(' ')[0]
            var equipo2Array = equipos.split(' ')
            equipo2 = equipo2Array[equipo2Array.length - 1]

            var goals = goles[i][j]
            var gol1 = Number(goals.split(' ')[0])
            var goles2Array = goals.split(' ')
            var gol2 = Number(goles2Array[goles2Array.length - 1])

            var imagenNombre = imagenes[i][j]
            var imagen1 = imagenNombre.split(' - ')[0]
            var imagen2Array = imagenNombre.split(' - ')
            var imagen2 = imagen2Array[imagen2Array.length - 1]

            console.log('gol1');
            console.log(gol1);
            console.log('gol2');
            console.log(gol2);
            console.log('-------');


            // console.log(goles);

            rondas[i][j] = k


            jornadaModel.findOneAndUpdate({numero: i+1},
            { $push:{ games: {equipo1: equipo1,nombre1: nombre1, goles1: gol1,imagen1: imagen1,
                              equipo2: equipo2,nombre2: nombre2, goles2: gol2, imagen2: imagen2}}},
            {new:true, useFindAndModify: false},(err, jornadaFase1Add) => { 

                // equipoModel.findByIdAndUpdate({_id: equipo1},{GF:})

             })
            

            k ++;
            if (k == numJornadas)
                k = 0;
        }   
    }

    console.log(imagenes);
    // console.log(rondas);
    console.log(goles);

        return res.status(200).send({juegosNombres})
    })
}

function create2DArray(filas, columnas) {
    var x = new Array(filas);
    for (var i = 0; i < filas; i++) {
        x[i] = new Array(columnas);
    }
    return x;
}

 function simularPartido(req,res){
    var subdocumentId = req.params.juegoId;
    var equipo1goles = Math.round(Math.random()*5)
    var equipo2goles = Math.round(Math.random()*5)

    jornadaModel.findOneAndUpdate({"games._id": subdocumentId}, {"games.$.goles1": equipo1goles, "games.$.goles2": equipo2goles}, {new: true, useFindAndModify: false}, (err, juegoActualizado) => {
        if(err) return res.status(500).send({mensaje: "Error al simular partido"});
        return res.status(200).send({mensaje: juegoActualizado});
    })

}

function obtenerJornadaPorLiga(req, res) {
    var ligaId = req.params.ligaId

    jornadaModel.find({liga: ligaId}, (err, jornadasEncontradas) => {
        if(err) return res.status(500).send({mensaje: "Error al encontrar jornada"})
        if(!jornadasEncontradas) return res.status(500).send({mensaje: "Jornada vacia"})
        return res.status(200).send({jornadasEncontradas});
    })
}



module.exports = {
    iniciarLiga,
    simularPartido,
    obtenerJornadaPorLiga
}