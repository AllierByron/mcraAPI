var express = require('express');
var router = express.Router();

//variables mias
var activo = false;
var llamadas = 0;
let data ={
    temperatura:"",
    humedad:""
}
var codigoDoc;
var activarSensor = false;

/* GET users listing. */
router.post('/', function(req, res) {
    llamadas++;
    activo = true;
    res.status(201).send('temperatura:'+req.body.temperatura+"\n"+    
                         'humedad: '+req.body.humedad);
    data.temperatura = req.body.temperatura;
    data.humedad = req.body.humedad;
    checkChanges();
    // res.send("si jala");
});

//function to check if the sensor its still transmiting data
function checkChanges(){
    let oldValue = llamadas;
    // console.log('old:'+llamadas);
    
    setTimeout(() => {
        // console.log('new:'+llamadas);    
        let newValue = llamadas;
        if(oldValue == newValue){
            activo = false;
            // console.log('igual?: '+(oldValue == newValue));
        }    
    }, 8000);    
}

//the next method works as a state notifier when solicited.
//the states are:
//active: it means the sensor is active and transmiting data
//inactive: it means the sensor its not active
//if it is active the data its send to the active ticket
router.post('/enviar', function(req, res) {
    if(activo){
        res.status(201).send({data});
    }else{
        res.status(201).send({message:'No esta activo el sensor'});
    }
});

router.get('/', async(req, res)=>{
    if(activarSensor){
        res.status(200).send(true);
    }else{
        res.status(200).send(false);
    }
});

router.get('/activarSensor/:estado', async(req, res)=>{
    if(req.params.estado == "a"){
        activarSensor = true;
    }else if(req.params.estado == "d"){
        activarSensor = false;
    }
    res.status(201).send({sensorActivado: activarSensor});
});

module.exports = router;