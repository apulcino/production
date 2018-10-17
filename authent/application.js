"use strict"
const constantes = require('../library/constantes');
const traceMgr = new (require('../library/tracemgr'))('AFOAuthent');
const consulMgr = require('../library/consulMgr').consulMgr;
const express = require('express');
const application = express();
var swaggerUi = require('swagger-ui-express');
var mServiceID = '';
var mServiceRef = {
    "Name": "authent-v1",
    "Tags": ["authentication", "v1"],
    "Address": "",
    "Port": 0
}

application.use(function (req, res, next) {
    res.setHeader('XAFP-HOST-SOURCE', mServiceRef.Address + ':' + mServiceRef.Port + ':' + process.pid);
    next();
});

const apiHealthRoutes = require('./APIHealth');
application.use(constantes.MSPathnameEnum.afoHealth, apiHealthRoutes);

const apiUserRoutes = require('./APIUser');
application.use(constantes.MSPathnameEnum.afoAuthent, apiUserRoutes);


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
    consulMgr.Register(mServiceRef,
        (err) => {
            traceMgr.error("consulMgr.Register : ", err)
        },
        (msID) => {
            mServiceID = msID;
            traceMgr.info("consulMgr.Register : ", msID)
        });
}

var signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
for (var i in signals) {
    process.on(signals[i], function () {
        closeGracefully(signals[i]);
    });
}
function closeGracefully() {
    //console.info('SIGINT signal received.')
    consulMgr.unRegister(mServiceID,
        (err) => {
            traceMgr.error("consulMgr.unRegister : ", err)
            process.exit(1);
        },
        (msID) => {
            traceMgr.info("consulMgr.unRegister : ", msID)
            mServiceID = '';
            process.exit(0);
        });
}

module.exports = application;