"use strict"
const constantes = require('../library/constantes');
const express = require('express');
const application = express();

const apiEventsRoutes = require('./APIEvents');
application.use(constantes.MSPathnameEnum.afoEvents, apiEventsRoutes);

const apiHealthRoutes = require('./APIHealth');
application.use(constantes.MSPathnameEnum.afoHealth, apiHealthRoutes);

module.exports = application;