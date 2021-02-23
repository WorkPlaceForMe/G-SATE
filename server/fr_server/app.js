var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
require('dotenv').config({ path: '../config.env'});
var bodyParser = require('body-parser');
var gracefulExit = require('express-graceful-exit');
const shell = require("shelljs");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(logger('Method: :method:url // Url: :remote-addr // Status::status // User-agent: :user-agent // Date: :date[web]'));


app.use(logger('Date: :date[web] // Url: :remote-addr // Method: :method:url // Status::status // User-agent: :user-agent', {
  stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/hola', function(req,res){
console.log('hola ' + Date(Date.now()).toString())
res.json('funciona la wea')
})

app.get('/api/turnOff', function(req,res){
  gracefulExit.gracefulExitHandler(app, server, {
      callback: messOff(),
      suicideTimeout: 1000
  });
  res.json('turned Off')
  });

  app.post('/api/startfr/', function(req, res, err){
    const camer = req.body;
    var n;
    var args = ' ';
    if(camer.length > 10){
        n = 10
    }else{
        n = camer.length;
    }
    for(let i = 0; i < n; i++){
        args += camer[i].rtsp + ' ';
    }
    shell.exec('bash ' + process.env.pathDocker + 'docker_run.sh '+ process.env.passServer + args, function(err,data){
        console.log('err: ',err)
        console.log('data: ',data);
    })
    res.send("success")
});

app.get('/api/stweb/', function(req,res,err){
    shell.exec('bash ' + process.env.pathDocker + 'docker_run1.sh '+ process.env.passServer), function(err,data){
        console.log('err: ',err);
        console.log('data: ',data);
        res.send("success")
    }
})


  let server = app.listen(process.env.fr_server, process.env.my_ip ,function(){
    let writeStream = fs.createWriteStream('./access.log', {flags: 'a'});
    var a = 'Server started at: ' + Date(Date.now()).toString() + '\r\n' + 'Using port ' + process.env.algo_server + ' for server. \r\n';
    writeStream.write(a);
    console.log(Date(Date.now()).toString());
    console.log('Running on ' + process.env.fr_server + '...');
  });


// catch 404 and forward to error handler -----------------------------------------------------------------------------------------
app.use(function(req, res, next) {
  next(createError(404));
});

messOff = function(){
  let writeStream = fs.createWriteStream('./access.log', {flags: 'a'});
  var a = 'Algo server stopped at: ' + Date(Date.now()).toString() + '\r\n';
  writeStream.write(a);
  console.log('shutting off')
}

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});


module.exports = app;
