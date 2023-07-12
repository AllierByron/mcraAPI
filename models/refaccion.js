const amongoose = require("mongoose");

const refaccionSchema = new amongoose.Schema({
    noRegistro: Number,
    nombre:String,
    codigo: String,
    cantidad: String,
    precio: String,
    foto: Array,
    estado: String,
    createdAt: Date,
    updatedAt: Date
});

amongoose.model("refaccion", refaccionSchema);