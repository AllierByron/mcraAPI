const amongoose = require("mongoose");

const medicionSchema = new amongoose.Schema({
    noRegistro: Number,
    createtAt: Date,
    values: [
        {
            hms: Date,
            data:{
                temperatura: Number,
                humedad: Number,
                msj: String,
                ohmios: Number
            }
        }
    ]
    
});

amongoose.model("medicion", medicionSchema);