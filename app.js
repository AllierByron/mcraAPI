var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
require('dotenv').config();

//conexion a mongo Atlas
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_STRING);
require('./models/usuario');
require('./models/refaccion');
require('./models/ticket');
require('./models/solicitud');
require('./models/tecnico');

//router
var indexRouter = require('./routes/index');
var usuariosRouter = require('./routes/usuarios');
var refaccionesRouter = require('./routes/refacciones');
var ticketsRouter = require('./routes/tickets');
var solcitudesRouter = require('./routes/solicitudes');
var tecnicosRouter = require('./routes/tecnicos');
var sensorRouter = require('./routes/sensorApi');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//rutas para las fotos
app.use('/fotoRefaccion', express.static(__dirname + '/imgs/refacciones'));
app.use('/fotoPerfil', express.static(__dirname + '/imgs/usuarios'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//cors
app.use(cors({
  origin:"http://localhost:4200",
  methods: "POST, GET, DELETE, PUT",
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use('/', indexRouter);
app.use('/usuarios', usuariosRouter);
app.use('/refacciones', refaccionesRouter);
app.use('/tickets', ticketsRouter);
app.use('/solicitudes', solcitudesRouter);
app.use('/tecnicos', tecnicosRouter);
app.use('/sensorApi', sensorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


