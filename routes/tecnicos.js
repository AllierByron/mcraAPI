/**
 * IMPORTANTE:
 * 
 * EL usuarioID es un campo que hace referencia a el noRegistro del
 * schema usuario.
 * 
 * CAMPO DE BUSQUEDA: noRegistro
 */

var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator');
const authTkn = require('../services/usuarioService');

//de mongo
const mongoose = require("mongoose");
const { route } = require('.');
const tecnico = mongoose.model("tecnico");
const usuario = mongoose.model("usuario");

//registrar Tecnico
router.post('/', authTkn.verificarHeaderToken, async (req, res)=>{
  
  let tec = await tecnico.findOne({usuarioID: req.body.usuarioID});
  if(tec) return res.status(401).send({message: "Tecnico ya enlazado a cuenta"});

  let usr = await usuario.findOne({noRegistro: req.body.usuarioID});

  if(!usr) return res.status(401).send({message: "Usuario no encontrado (!usuarioID)"});

  tec = await tecnico.count({});

  let tecnicoNuevo = await new tecnico({
    noRegistro: parseInt(tec)+1,
    usuarioID:req.body.usuarioID,
    nombre:req.body.nombre,
    tipoTecnico: req.body.tipoTecnico,
    zona: req.body.zona,
    estado: req.body.estado,
    createdAt: Date.now(),
    updatedAt: Date.now()

  });

  await tecnicoNuevo.save();

  res.status(201).send({tecnicoNuevo});

});

//obtener todos los tecnicos
router.post('/getTecnicos', authTkn.verificarHeaderToken, async(req, res)=>{
  let tecs = await tecnico.find({});
  res.status(201).send({tecs});
});

router.put('/', authTkn.verificarHeaderToken ,async (req, res)=>{
  let tec = await tecnico.findOne({noRegistro: req.body.noRegistro});
  if(!tec) return res.status(401).send({message: 'Tecnico no encontrado'});

  if(tec.estado == 'Inactivo') return res.status(401).send({message: 'Tecnico inactivo'});

  let tecActualizado = await tecnico.findOneAndUpdate(
    {noRegistro: req.body.noRegistro},
    {
        usuarioID:req.body.usuarioID,
        nombre:req.body.nombre,
        tipoTecnico: req.body.tipoTecnico,
        zona: req.body.zona,
        estado: req.body.estado,
        updatedAt: Date.now()
    },
    {new: true}
  );

  await tecActualizado.save();

  res.status(200).send({tecActualizado});

});

router.get('/:noRegistro', authTkn.verificarHeaderToken, async(req, res)=>{
  let tec = await tecnico.findOne({noRegistro: req.params.noRegistro});
  if(!tec) return res.status(401).send({message: 'Tecnico no encontrado'});

  if(tec.estado == 'Inactivo') return res.status(401).send({message: 'Tecnico Inactivo'});

  res.status(200).send({usr: tec});

});

router.delete('/:noRegistro',authTkn.verificarHeaderToken, async (req, res)=>{
  let tec = await tecnico.findOne({noRegistro: req.params.noRegistro});
  if(!tec) return res.status(401).send({message: 'Tecnico no encontrado'});

  tec.estado = 'Inactivo';
  tec.updatedAt = Date.now();
  await tec.save();
  res.status(200).send({tec});
});

router.get('/', async(req, res)=>{
  let tec = await tecnico.find({});
  
  res.status(200).send({tec});
});

module.exports = router;
