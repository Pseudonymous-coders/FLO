const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const https = require('https');
const fs = require('fs');
const sqlite3 = require('sqlite3');
const net = require('net');
const ws =require('ws');

const app = express();
const configDB = require('./config/database');
const privateKey = fs.readFileSync('sslCert/private.pem', 'utf8');
const certificate = fs.readFileSync('sslCert/cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

require('./config/passport')(passport);
require('./basics');

mongoose.connect(configDB.url, configDB.options);
const mongoConn = mongoose.connection;

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/webSrc'));

app.set('view engine', 'ejs');

app.use(session({secret: 'SuperSecretSlumber', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
setTimeout(()=>{
  require('./app/api')(app, passport);
  require('./app/web')(app, passport);
},500);

global.httpServer = http.createServer((req,res)=>{
  res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
  res.end();
});

global.httpsServer = https.createServer(credentials, app);

mongoConn.on('open',()=>{
  console.log('Listening')
});
mongoConn.on('error', console.error.bind(console, 'Connection error:'));
mongoConn.on('disconnected', ()=>{
  console.log("Closed aparently, not sure why");
});


global.httpServer.listen(80);
global.httpsServer.listen(443);
