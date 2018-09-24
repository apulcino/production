const http = require('http');
const application = require('./application');
const constantes = require('../library/constantes');
const multicastRecver = require('../library/multicastRecver');
const regsitryMgr = require('../library/registryMgr');
const traceMgr = new (require('../library/tracemgr'))('AFOPaniers');

const port = process.env.PORT || 0;

let AFORegisteryUrl = [];

const server = http.createServer(application);
server.listen(port, function () {
  var host = constantes.getServerIpAddress();
  var port = server.address().port
  constantes.declareService(traceMgr, AFORegisteryUrl, constantes.MSTypeEnum.afoPaniers, host, port, constantes.MSPathnameEnum.afoPaniers);
  traceMgr.info("listening at http://%s:%s", host, port);
  application.initialize(host, port);
});

const regMgr = new regsitryMgr(traceMgr);
const mcRecver = new multicastRecver(constantes.getServerIpAddress(), constantes.MCastAppPort, constantes.MCastAppAddr, constantes.getServerPublicIpAddress(), (address, port, message) => {
  traceMgr.debug('Recv Msg From : ' + address + ':' + port + ' - ' + JSON.stringify(message));
  if (message.type === constantes.MSMessageTypeEnum.regAnnonce) {
    regMgr.add(message.host, message.port);
  }
});


