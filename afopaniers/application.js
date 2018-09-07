const constantes = require('../library/constantes');
const express = require('express');
const application = express();

const apiSelectionsRoutes = require('./APISelections');
application.use(constantes.MSPathnameEnum.afoPaniers, apiSelectionsRoutes);

const apiHealthRoutes = require('./APIHealth');
application.use(constantes.MSPathnameEnum.afoHealth, apiHealthRoutes);

module.exports = application;