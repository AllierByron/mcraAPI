const amongoose = require("mongoose");

const solicitudSchema = new amongoose.Schema({
    noRegistro: Number,
    nombre: String,
    apellidos: String,
    titulo:String,
    descripcion: String,
    correo: String,//opcionales
    numeroTel: String,//este campo en este caso no es opcional
    direccion: String,//opcionales
    zona: String,
    tecnicoAsignado: String,    
    estado: String,//1° Creado, 2° Asignado, 3° Activo, 4° Completado, 5° Inactivo
    createdAt: Date,
    updatedAt: Date
});

amongoose.model("solicitud", solicitudSchema);