const amongoose = require("mongoose");

const tecnicoSchema = new amongoose.Schema({
    noRegistro: Number,
    usuarioID:Number,
    nombre:String,
    tipoTecnico: String,
    zona: String,
    estado: String,
    createdAt: Date,
    updatedAt: Date
});

amongoose.model("tecnico", tecnicoSchema);