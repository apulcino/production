"use strict"
const config = require('config');
const http = require('http');
const application = require('./application');
const constantes = require('../library/constantes');
const multicastRecver = require('../library/multicastRecver');
const regsitryMgr = require('../library/registryMgr');
const traceMgr = new (require('../library/tracemgr'))('AFOAuthent');

let port = 0;
if (config.has('Components.AFOAuthent.port')) {
  port = config.get('Components.AFOAuthent.port');
}

let AFORegisteryUrl = [];

const server = http.createServer(application);
server.listen(port, function () {
  var host = constantes.getServerIpAddress();
  var port = server.address().port
  // var intervalObj = setInterval(() => {
  //   let AFORegisteryUrl = regMgr.getList();
  //   if (0 !== AFORegisteryUrl.length) {
  //     constantes.declareService(traceMgr, AFORegisteryUrl, constantes.MSTypeEnum.afoAuthent, host, port, constantes.MSPathnameEnum.afoAuthent);
  //   }
  // }, 10000);
  constantes.declareService(traceMgr, AFORegisteryUrl, constantes.MSTypeEnum.afoAuthent, host, port, constantes.MSPathnameEnum.afoAuthent);
  traceMgr.info("listening at http://%s:%s", host, port)
  application.initialize(host, port);
});

const regMgr = new regsitryMgr();
const mcRecver = new multicastRecver(constantes.getServerIpAddress(), constantes.MCastAppPort, constantes.MCastAppAddr, constantes.getServerPublicIpAddress(), (address, port, message) => {
  traceMgr.debug('Recv Msg From : ' + address + ':' + port + ' - ' + JSON.stringify(message));
  if (message.type === constantes.MSMessageTypeEnum.regAnnonce) {
    regMgr.add(message.host, message.port);
  }
});

