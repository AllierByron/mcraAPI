/**
 * IMPORTANTE:
 * NO HAY FUNCION DE LOGOUT
 * La funcion del logout no es necesaria debido a la caducidad de los tokens.
 * Un token dura 24h. El unico proceso necesario para eliminar el acceso a la
 * app, o mas conocido como "logout" es eliminar la cookie donde almacenaron
 * el token.
 * 
 * EN POCAS PALABRAS USTEDES SON EL LOGOUT
 * 
 * 
 * CAMPO DE BUSQUEDA: Email
 */

var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator');
const authTkn = require('../services/usuarioService');

//de mongo
const mongoose = require("mongoose");
const { route } = require('.');
const usuario = mongoose.model("usuario");

//para fotos
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const fotoPath = './imgs/usuarios';
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

//registrar usuario
//una vez registrado el usuario este tiene que iniciar sesion,
//la sesion no sera iniciada automaticamente

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
//guardar refaccion       //    V
router.post('/', upload.single('img'),async (req, res)=>{
  
  let usr = await usuario.findOne({email: req.body.email});
  if(usr) return res.status(401).send({message: "Cuenta existente"});

  let salt = await bcrypt.genSalt(10);
  let encrytedPass = await bcrypt.hash(req.body.password, salt);

  usr = await usuario.count({});

  let usuarioNuevo = await new usuario({
    noRegistro: parseInt(usr)+1,
    nombre: req.body.nombre,
    foto: fileName,
    apellidoMaterno: req.body.apellidoMaterno,
    apellidoPaterno: req.body.apellidoPaterno,
    email: req.body.email,
    puesto: req.body.puesto,
    RFC: req.body.RFC,
    password: encrytedPass,
    estado: 'Activo',
    createdAt: Date.now(),
    updatedAt: Date.now()
  });

  await usuarioNuevo.save();

  res.status(201).send({usuarioNuevo});

});

//logear al usuario
router.post('/login', async (req, res)=>{
  let usr = await usuario.findOne({email:req.body.email});

  if(!usr) return res.status(401).send({error:'Usuario no encontrado'});

  if(!await bcrypt.compare(req.body.password, usr.password)){
    return res.status(401).send({error:'Email o contraseña incorrectos'});
  }

  let token = authTkn.crearToken({email: usr.email, nombre: usr.nombre});

  return res.status(200).send({token: token});

})

//obtener todos los usuarios
router.post('/getUsers', authTkn.verificarHeaderToken, async(req, res)=>{
  let usrs = await usuario.find({});
  res.status(201).send({usrs});
});

router.put('/', [authTkn.verificarHeaderToken, upload.single('img')] ,async (req, res)=>{
  let usr = await usuario.findOne({email: req.body.email});
  if(!usr) return res.status(401).send({message: 'Usuario no encontrado'});

  if(usr.estado == 'Inactivo') return res.status(401).send({message: 'Usuario inactivo'});

  await fs.unlink(path.resolve('imgs/usuarios/'+usr.foto));

  let usrActualizado = await usuario.findOneAndUpdate(
    {email: req.body.email},
    {
      nombre: req.body.nombre,
      apellidoMaterno: req.body.apellidoMaterno,
      apellidoPaterno: req.body.apellidoPaterno,
      puesto: req.body.puesto,
      foto: fileName,
      RFC: req.body.RFC,
      password: req.body.password,
      updatedAt: Date.now()
    },
    {new: true}
  );

  await usrActualizado.save();

  res.status(200).send({usrActualizado});

});

router.get('/:email', authTkn.verificarHeaderToken, async(req, res)=>{
  let usr = await usuario.findOne({email: req.params.email});
  if(!usr) return res.status(401).send({message: 'Usuario no encontrado'});

  if(usr.estado == 'Inactivo') return res.status(401).send({message: 'Usuario Inactivo'});
  
  usr.foto = 'http://localhost:3000/fotoPerfil/'+usr.foto;

  res.status(200).send({usr});

});

router.delete('/:email',authTkn.verificarHeaderToken, async (req, res)=>{
  let usr = await usuario.findOne({email: req.params.email});
  if(!usr) return res.status(401).send({message: 'Usuario no encontrado'});

  await fs.unlink(path.resolve('imgs/usuarios/'+usr.foto));
  usr.foto = "";
  usr.estado = 'Inactivo';
  usr.updatedAt = Date.now();
  await usr.save();
  res.status(200).send({usrEliminado: usr});
});

module.exports = router;
