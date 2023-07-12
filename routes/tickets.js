/**
 * IMPORTANTE: 
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
const ticket = mongoose.model("ticket");
const tecnico = mongoose.model("tecnico");

router.post('/',authTkn.verificarHeaderToken, async (req, res)=>{
  
  // let zona;
  let tik = await ticket.findOne({descripcion: req.body.descripcion});
  if(tik) return res.status(401).send({message: "Ticket existente"});

  if(req.body.tecnicoAsignado){
    let tec = await tecnico.findOne({noRegistro: req.body.tecnicoAsignado});
    if(!tec) return res.status(401).send({message: "Tecnico no encontrado"});
    // zona = tec.zona;
  }

  tik = await ticket.count({});

  let ticketNuevo = await new ticket({
    noRegistro: parseInt(tik)+1,
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    correo: req.body.correo,
    numeroTel: req.body.numeroTel,
    direccion: req.body.direccion,
    zona: req.body.zona,
    tecnicoAsignado: req.body.tecnicoAsignado,
    estado: 'Creado',
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  await ticketNuevo.save();

  res.status(201).send({ticketNuevo});

});

//obtener todos los tickets
router.get('/', authTkn.verificarHeaderToken, async(req, res)=>{
  let tik = await ticket.find({});
  res.status(201).send({tik});
});

router.put('/', authTkn.verificarHeaderToken ,async (req, res)=>{
  let tik = await ticket.findOne({noRegistro: req.body.noRegistro});
  if(!tik) return res.status(401).send({message: 'Ticket no encontrado'});

  if(tik.estado == 'Inactivo') return res.status(401).send({message: 'Ticket inactivo'});



  let tikActualizado = await ticket.findOneAndUpdate(
    {noRegistro: req.body.noRegistro},
    {
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      correo: req.body.correo,
      numeroTel: req.body.numeroTel,
      direccion: req.body.direccion,
      zona: req.body.zona,
      tecnicoAsignado: req.body.tecnicoAsignado,
      estado: req.body.estado,
      updatedAt: Date.now()
    },
    {new: true}
  );

  await tikActualizado.save();

  res.status(200).send({tikActualizado});

});

router.get('/:noRegistro', authTkn.verificarHeaderToken, async(req, res)=>{
  let tik = await ticket.findOne({noRegistro: req.body.noRegistro});
  if(!tik) return res.status(401).send({message: 'Ticket no encontrado'});

  if(tik.estado == 'Inactivo') return res.status(401).send({message: 'Ticket Inactivo'});

  res.status(200).send({tik});

});

router.delete('/:noRegistro',authTkn.verificarHeaderToken, async (req, res)=>{
  let tik = await ticket.findOne({noRegistro: req.params.noRegistro});
  if(!tik) return res.status(401).send({message: 'Ticket no encontrado'});

  tik.estado = 'Inactivo';
  tik.updatedAt = Date.now();
  await tik.save();
  res.status(200).send({tik});
});

//LOS SIGUIENTES METODOS SON PARA PASAR A LOS DISTINTOS ESTADOS DISPONIBLES:
//2° Asignado, 3° Activo, 4° Completado
//CADA ESTADO TIENE SU PROPIO METODO

//2° Asignado
router.post('/asignar', async(req, res)=>{
  let tik = await ticket.findOne({noRegistro: req.body.noRegistro});
  if(!tik) return res.status(401).send({message: 'Ticket no encontrado'});

  if(tik.estado == 'Inactivo') return res.status(401).send({message: 'Ticket inactivo'});
  
  if(!req.body.tecnicoAsignado || req.body.tecnicoAsignado == "") return res.status(401).send({message: 'Campo "tecnico asignado" faltante'});

  if(req.body.tecnicoAsignado){
    let tec = await tecnico.findOne({noRegistro: req.body.tecnicoAsignado});
    if(!tec) return res.status(401).send({message: "Tecnico no encontrado"});
  }

  let tikActualizado = await ticket.findOneAndUpdate(
    {noRegistro: req.body.noRegistro},
    {
      tecnicoAsignado: req.body.tecnicoAsignado,
      estado: 'Asignado',
      updatedAt: Date.now()
    },
    {new: true}
  );

  await tikActualizado.save();

  res.status(200).send({tikActualizado});
});

//3° Activo
router.post('/activar', async(req, res)=>{
  let tik = await ticket.findOne({noRegistro: req.body.noRegistro});
  if(!tik) return res.status(401).send({message: 'Ticket no encontrado'});

  if(tik.estado == 'Inactivo') return res.status(401).send({message: 'Ticket inactivo'});

  let tikActualizado = await ticket.findOneAndUpdate(
    {noRegistro: req.body.noRegistro},
    {
      estado: 'Activo',
      updatedAt: Date.now()
    },
    {new: true}
  );

  await tikActualizado.save();

  res.status(200).send({tikActualizado});
});

//4° Completado
router.post('/completar', async(req, res)=>{
  let tik = await ticket.findOne({noRegistro: req.body.noRegistro});
  if(!tik) return res.status(401).send({message: 'Ticket no encontrado'});

  if(tik.estado == 'Inactivo') return res.status(401).send({message: 'Ticket inactivo'});

  let tikActualizado = await ticket.findOneAndUpdate(
    {noRegistro: req.body.noRegistro},
    {
      estado: 'Completado',
      updatedAt: Date.now()
    },
    {new: true}
  );

  await tikActualizado.save();

  res.status(200).send({tikActualizado});
});


module.exports = router;
