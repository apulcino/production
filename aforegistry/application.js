"use strict"
const constantes = require('../library/constantes');
const express = require('express');
const application = express();

var swaggerUi = require('swagger-ui-express');
// var swaggerDocument = require('./swagger.json');

// // http://localhost:XXXX/api-docs.
// application.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const apiRegistryRoutes = require('./registry');
application.use(constantes.MSPathnameEnum.afoRegistry, apiRegistryRoutes);

const apiHealthRoutes = require('./APIHealth');
application.use(constantes.MSPathnameEnum.afoHealth, apiHealthRoutes);

application.initialize = function (host, port) {
    // http://localhost:XXXX/api-docs.
    var swaggerDocument = require('./swagger.json');
    swaggerDocument.host = host + ':' + port;
    application.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
module.exports = application;