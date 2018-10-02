"use strict"
const constantes = require('../library/constantes');
const consulMgr = require('../library/consulMgr').consulMgr;
const express = require('express');
const application = express();
var swaggerUi = require('swagger-ui-express');
var mServiceRef = {
    "Name": "authent-v1",
    "Tags": ["authentication", "v1"],
    "Address": "",
    "Port": 0
}


application.use(function (req, res, next) {
    res.setHeader('XAFP-HOST-SOURCE', mServiceRef.Address + ':' + mServiceRef.Port);
    next();
});

const apiUserRoutes = require('./APIUser');
application.use(constantes.MSPathnameEnum.afoAuthent, apiUserRoutes);

const apiHealthRoutes = require('./APIHealth');
application.use(constantes.MSPathnameEnum.afoHealth, apiHealthRoutes);

application.initialize = function (host, port) {
    // http://localhost:XXXX/api-docs.
    var swaggerDocument = require('./swagger.json');
    swaggerDocument.host = host + ':' + port;
    application.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    mServiceRef = {
        "Name": "authent-v1",
        "Tags": ["authentication", "v1"],
        "Address": host,
        "Port": port
    };
    consulMgr.Register(mServiceRef);
}

module.exports = application;