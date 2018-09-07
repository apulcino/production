"use strict"
const http = require('http');
const application = require('./application');
const constantes = require('../library/constantes');
const multicastRecver = require('../library/multicastRecver');
const regsitryMgr = require('../library/registryMgr');
const traceMgr = new (require('../library/tracemgr'))('AFOEvents');

const port = process.env.PORT || 0;

const server = http.createServer(application);
server.listen(port, function () {
  var host = constantes.getServerIpAddress();
  var port = server.address().port
  // var intervalObj = setInterval(() => {
  //   let AFORegisteryUrl = regMgr.getList();
  //   if (0 !== AFORegisteryUrl.length) {
  //     constantes.declareService(traceMgr, AFORegisteryUrl, constantes.MSTypeEnum.afoEvents, host, port, constantes.MSPathnameEnum.afoEvents);
  //   }
  // }, 10000);
  constantes.declareService(traceMgr, [], constantes.MSTypeEnum.afoEvents, host, port, constantes.MSPathnameEnum.afoEvents);
  console.log("EventsSrv listening at http://%s:%s", host, port)

});

const regMgr = new regsitryMgr(traceMgr);
const mcRecver = new multicastRecver(constantes.getServerIpAddress(), constantes.MCastAppPort, constantes.MCastAppAddr, constantes.getServerPublicIpAddress(), (address, port, message) => {
  traceMgr.log('Recv Msg From : ' + address + ':' + port + ' - ' + JSON.stringify(message));
  if (message.type === constantes.MSMessageTypeEnum.regAnnonce) {
    regMgr.add(message.host, message.port);
  }
});
