const amongoose = require("mongoose");

const usuarioSchema = new amongoose.Schema({
    noRegistro: Number,
    nombre:String,
    foto: String,
    apellidoMaterno: String, 
    apellidoPaterno: String,
    email: String,
    puesto: String,
    RFC: String,
    password: String,
    estado: String,
    createdAt: Date,
    updatedAt: Date
});

amongoose.model("usuario", usuarioSchema);