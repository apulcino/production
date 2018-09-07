"use strict"
const constantes = require('../library/constantes');
const express = require('express');
const application = express();

var swaggerUi = require('swagger-ui-express');

const apiUserRoutes = require('./APIUser');
application.use(constantes.MSPathnameEnum.afoAuthent, apiUserRoutes);

const apiHealthRoutes = require('./APIHealth');
application.use(constantes.MSPathnameEnum.afoHealth, apiHealthRoutes);

application.initialize = function (host, port) {
    // http://localhost:XXXX/api-docs.
    var swaggerDocument = require('./swagger.json');
    swaggerDocument.host = host + ':' + port;
    application.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = application;