/**
 * IMPORTANTE: 
 * CAMPO DE BUSQUEDA: noRegistro
 * 
 * Solicitudes es simplemente un clon de tickets, con la diferencia de que el 
 * campo de telefono es obligatorio para la creacion de una. 
 * Pense en hacer este clon para tener una separacion entre lo
 * que se ingresan los empleados, y lo que ingresan los clientes.
 * 
 */

var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator');
const authTkn = require('../services/usuarioService');

//de mongo
const mongoose = require("mongoose");
const { route } = require('.');
const solicitud = mongoose.model("solicitud");

router.post('/', authTkn.verificarHeaderToken, async (req, res)=>{
  
  let soli = await solicitud.findOne({descripcion: req.body.descripcion});
  if(soli) return res.status(401).send({message: "Solicitud existente"});
  
  if(!req.body.numeroTel || req.body.numeroTel == "") return res.status(401).send({message: "Campo telefono no ingresado"});

  soli = await solicitud.count({});

  let soliNueva = await new solicitud({
    noRegistro: parseInt(soli)+1,
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

  await soliNueva.save();

  res.status(201).send({soliNueva});

});

//obtener todos los tickets
router.get('/', authTkn.verificarHeaderToken, async(req, res)=>{
  let soli = await solicitud.find({});
  res.status(201).send({soli});
});

router.put('/', authTkn.verificarHeaderToken ,async (req, res)=>{
  let soli = await solicitud.findOne({noRegistro: req.body.noRegistro});
  if(!soli) return res.status(401).send({message: 'Solicitud no encontrada'});

  if(soli.estado == 'Inactivo') return res.status(401).send({message: 'Solicitud inactiva'});

  let soliActualizada = await solicitud.findOneAndUpdate(
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

  await soliActualizada.save();

  res.status(200).send({soliActualizada});

});

router.get('/:noRegistro', authTkn.verificarHeaderToken, async(req, res)=>{
  let soli = await solicitud.findOne({noRegistro: req.body.noRegistro});
  if(!soli) return res.status(401).send({message: 'Solicitud no encontrada'});

  if(soli.estado == 'Inactivo') return res.status(401).send({message: 'Solicitud inactiva'});

  res.status(200).send({soli});

});

router.delete('/:noRegistro',authTkn.verificarHeaderToken, async (req, res)=>{
  let soli = await solicitud.findOne({noRegistro: req.params.noRegistro});
  if(!soli) return res.status(401).send({message: 'Solicitud no encontrada'});

  soli.estado = 'Inactivo';
  soli.updatedAt = Date.now();
  await soli.save();
  res.status(200).send({soli});
});

//LOS SIGUIENTES METODOS SON PARA PASAR A LOS DISTINTOS ESTADOS DISPONIBLES:
//2° Asignado, 3° Activo, 4° Completado
//CADA ESTADO TIENE SU PROPIO METODO

//2° Asignado
router.post('/asignar', async(req, res)=>{
  let soli = await solicitud.findOne({noRegistro: req.body.noRegistro});
  if(!soli) return res.status(401).send({message: 'Solicitud no encontrada'});

  if(soli.estado == 'Inactivo') return res.status(401).send({message: 'Solicitud inactiva'});
  
  if(!req.body.tecnicoAsignado || req.body.tecnicoAsignado == "") return res.status(401).send({message: 'Campo "tecnico asignado" faltante'});

  let tikActualizado = await solicitud.findOneAndUpdate(
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
  let soli = await solicitud.findOne({noRegistro: req.body.noRegistro});
  if(!soli) return res.status(401).send({message: 'Solicitud no encontrada'});

  if(soli.estado == 'Inactivo') return res.status(401).send({message: 'Solicitud inactiva'});

  let soliActualizada = await solicitud.findOneAndUpdate(
    {noRegistro: req.body.noRegistro},
    {
      estado: 'Activo',
      updatedAt: Date.now()
    },
    {new: true}
  );

  await soliActualizada.save();

  res.status(200).send({soliActualizada});
});

//4° Completado
router.post('/completar', async(req, res)=>{
  let soli = await solicitud.findOne({noRegistro: req.body.noRegistro});
  if(!soli) return res.status(401).send({message: 'Solcitud no encontrada'});

  if(soli.estado == 'Inactivo') return res.status(401).send({message: 'Solicitud inactiva'});

  let soliActualizada = await solicitud.findOneAndUpdate(
    {noRegistro: req.body.noRegistro},
    {
      estado: 'Completado',
      updatedAt: Date.now()
    },
    {new: true}
  );

  await soliActualizada.save();

  res.status(200).send({soliActualizada});
});


module.exports = router;
