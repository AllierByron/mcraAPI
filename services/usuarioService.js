const jwt = require("jsonwebtoken");
const secret = 'ULTRA-SECRET_KEY';
const secretRefresh = 'ULTRA/MEGA-SECRET_KEY';
const mongoose = require("mongoose");
const usuario = mongoose.model("usuario");

//funcion para crear el token
exports.crearToken = (user)=>{
    return jwt.sign(user, secret, {expiresIn: '24h'});     
}

//funcion conocida como middleware, verificacion de autenticidad del token
exports.verificarHeaderToken = (req, res, next)=>{
    // if(false){
    //     const authHeader = req.headers['authorization'];//del la solicitud http obtenemos el header especificado
    //     const token = authHeader && authHeader.split(' ')[1];//la palabra bearer viene en el header, separamos el token
    //     if(token == null) return res.status(401).send('No se ha enviado token');//si la operacion anterior falla, se envia

    //     //si el token es contenido ahora se verifica que sea valido
    //     jwt.verify(token, secret, (err, usuario)=>{
    //         if(err) return res.status(403).send({err});//si existe algun error este se retorna
    //         // console.log(usuario);
    //         req.usuario = usuario;//'usuario' es el PAYLOAD o el contenido del token
    //         next();//se inicia el siguente callback
    //     });
    // }
    next();
}