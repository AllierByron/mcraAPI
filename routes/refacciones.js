/**FENEEK 2023
 * Devs: 
 * Cesar
 * Clemente
 * Byron 
 * 
 * CAMPO DE BUSQUEDA: codigo de refaccion
 * 
 * Ningun error de mongo, multer o fs esta siendo manejado. Si ocurre algo relacionado 
 * con uno de esos 3 diganme.
 * 
 * REFIERANSE AL METODO DE POST '/' (url normal), aplica tanto para este, como
 * para el de put (actualizar)
 */


var express = require('express');
var router = express.Router();
const authTkn = require('../services/usuarioService');
const mongoose = require("mongoose");
const refaccion = mongoose.model("refaccion");
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
// const { route } = require('.');

const fotoPath = './imgs/refacciones';
var fileName;
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, fotoPath);
    },
    filename:(req, file, cb)=>{
        // console.log(file);
        fileName = Date.now() + file.originalname;
        // console.log(fileName);
        cb(null, fileName);
    }
});

const upload = multer({storage: storage});

                                                //este parametro del
                                                //'upload.single' que
                                                //vez aqui, es
                                                //importante que
                                                //coincida con el
                                                //campo que tienes
                                                //para enviar las
                                                //imgs. Osea :
                                                //<div ... name="img">
                                            //    |
                                            //    |
//guardar refaccion                         //    V
router.post('/', [authTkn.verificarHeaderToken, upload.single('img')], async(req, res)=>{
    let refa = await refaccion.findOne({nombre: req.body.nombre});

    if(refa) return res.status(401).send({error: "Nombre de refaccion ya existente"});

    refa = await refaccion.findOne({}).sort({_id:-1}).limit(1);

    // console.log({refa: refa2.codigo});
    
    let refaNueva = await new refaccion({
        noRegistro: parseInt(refa.noRegistro)+1,
        nombre: req.body.nombre,
        codigo: req.body.codigo,
        cantidad: req.body.cantidad,
        precio: req.body.precio,
        /*$push: {*/foto: fileName/*}*/,
        estado: 'Activa',
        createdAt: Date.now(),
        updatedAt: Date.now()
    });

    await refaNueva.save();

    res.status(201).send({refaNueva});
});

//actualizar info de refaccion
router.put('/',[authTkn.verificarHeaderToken, upload.single('img')], async(req, res)=>{
    let refa = await refaccion.findOne({codigo: req.body.codigo});
    if(!refa) return res.status(402).send({message: 'No existe la refaccion'});
    

    let refaActualizada = await refaccion.findOneAndUpdate(
        {codigo: req.body.codigo},
        {
            nombre: req.body.nombre,
            codigo: req.body.codigo,
            cantidad: req.body.cantidad,
            precio: req.body.precio,
            $push: {foto: fileName},
            updatedAt: Date.now()
        },
        {new: true}
    );

    await refaActualizada.save();

    res.status(200).send({refaActualizada});

});


//obtener toda la informacion de una refaccion
router.get('/:codigo',authTkn.verificarHeaderToken, async (req,res)=>{
    
    let refa = await refaccion.findOne({codigo: req.params.codigo});        
    
    if(!refa) return res.status(401).send({error: 'Error'});

    if(refa.estado == 'Inactiva') return res.status(401).send({message: 'Refaccion Inactiva'});
    //la url para accesar no esta registrada en la db, solo el nombre de
    //las imgs registradas a la refaccion, mas seguridad
    //agrego la url una vez que se procesa la solicitud 'get'
    for (let i = 0; i < refa.foto.length; i++) {
        refa.foto[i] = 'http://localhost:3000/fotoRefaccion/'+refa.foto[i];
    }

    res.status(200).send({refa});

});

//delete, borrado logico
router.delete('/:codigo', authTkn.verificarHeaderToken, async (req, res)=>{
    let refa = await refaccion.findOne({codigo: req.params.codigo});
    if(!refa) return res.status(401).send({message: 'No encontrada'});

    for (let i = 0; i < refa.foto.length; i++) {
        await fs.unlink(path.resolve('imgs/refacciones/'+refa.foto[i]));
    }

    refa.estado = 'Inactiva';
    refa.updatedAt = Date.now();
    refa.foto = [];
    await refa.save();
    
    res.status(200).send({refa});
});

router.get('/', authTkn.verificarHeaderToken, async(req, res)=>{
    let refa = await refaccion.find({});
    res.status(201).send({refa});
});

module.exports = router;