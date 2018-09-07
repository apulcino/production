"use strict"
const http = require('http');
const application = require('./application');
const constantes = require('../library/constantes');
const traceMgr = new (require('../library/tracemgr'))('AFORegistry');
const multicastSender = require('../library/multicastSender');
const multicastRecver = require('../library/multicastRecver');
const DataShared = require('./DataShared').DataShared;
DataShared.initialize(traceMgr);

const port = process.env.PORT || 0;

// Diffuseur de notification multicast
const mcSender = new multicastSender(constantes.MCastAppPort, constantes.MCastAppAddr, constantes.getServerPublicIpAddress());
// Créer un serveur HTTP
const server = http.createServer(application);
server.listen(port, function () {
  var host = constantes.getServerIpAddress();
  var port = server.address().port
  mcSender.sendAlways(JSON.stringify({ type: constantes.MSMessageTypeEnum.regAnnonce, host: host, port: port }), 10000);
  traceMgr.info("AFORegistry listening at http://%s:%s", host, port);
  application.initialize(host, port);
});

//const MServices = new MServiceMgr(traceMgr);
const mcRecver = new multicastRecver(constantes.getServerIpAddress(), constantes.MCastAppPort, constantes.MCastAppAddr, constantes.getServerPublicIpAddress(), (address, port, message) => {
  switch (message.type) {
    case constantes.MSMessageTypeEnum.compoDeclare:
      traceMgr.info('MCast Msg: From: ' + address + ':' + port + ' - ' + JSON.stringify(message));
      DataShared.MServices.declare('http', message.compoType, message.host, message.port, message.pathname);
      break;
    default:
      traceMgr.debug('MCast Msg: From: ' + address + ':' + port + ' - ' + JSON.stringify(message));
      break;
  }
});
// traceMgr.log('AFORegistry RESTful API server started on: ' + port);
