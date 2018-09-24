const constantes = require('../library/constantes');
const consulMgr = require('../library/consulMgr').consulMgr;
const express = require('express');
const application = express();

const apiSelectionsRoutes = require('./APISelections');
application.use(constantes.MSPathnameEnum.afoPaniers, apiSelectionsRoutes);

const apiHealthRoutes = require('./APIHealth');
application.use(constantes.MSPathnameEnum.afoHealth, apiHealthRoutes);

application.initialize = function (host, port) {
    // // http://localhost:XXXX/api-docs.
    // var swaggerDocument = require('./swagger.json');
    // swaggerDocument.host = host + ':' + port;
    // application.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    var ID = "Selections-v1-" + (new Date()).getTime();
    consulMgr.Register({
        "ID": ID,
        "Tags": ["selections", "v1"],
        "Address": host,
        "Port": port
    });
}

module.exports = application;