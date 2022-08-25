const keys = require("./keys");

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const mqtt = require('mqtt');

var expressWs = require('express-ws')(app);
expressWs.app.ws('/data', function(ws, req){});
var aWss = expressWs.getWss('/data');

const host = 'planetaryevents.iic2173.net'
const port = '9000'
const clientId = "common"

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'common',
  password: 'iic2173',
  reconnectPeriod: 1000,
})
const topic = "global-emergencies"
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})

client.on('message', (topic, payload) => {
  aWss.clients.forEach(function (client) {
    client.send(payload.toString());
    });
  console.log('Received Message:', topic, payload.toString())
  })

// Postgres client
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.database,
  password: keys.password,
  port: keys.port
});

pgClient.on("connect", client => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch(err => console.log(err));
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
