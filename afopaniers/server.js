"use strict"
const config = require('config');
const http = require('http');
const application = require('./application');
const constantes = require('../library/constantes');
const traceMgr = new (require('../library/tracemgr'))('AFOPaniers');

if (config.has('title')) {
  traceMgr.info("using configuration file : %s", config.get('title'));
}
let port = process.env.PORT || 0;
if (config.has('Components.AFOSelections.port')) {
  port = config.get('Components.AFOSelections.port');
}

const server = http.createServer(application);
server.listen(port, function () {
  var host = constantes.getServerIpAddress();
  var port = server.address().port
  traceMgr.info("listening at http://%s:%s", host, port);
  application.initialize(host, port);
});

