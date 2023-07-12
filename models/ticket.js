const amongoose = require("mongoose");

const ticketSchema = new amongoose.Schema({
    noRegistro: Number,
    titulo:String,
    descripcion: String,
    correo: String,//opcionales
    numeroTel: String,//opcionales
    direccion: String,//opcionales
    zona: String,
    tecnicoAsignado: Number,    
    estado: String,//1° Creado, 2° Asignado, 3° Activo, 4° Completado, 5° Inactivo
    createdAt: Date,
    updatedAt: Date
});

amongoose.model("ticket", ticketSchema);