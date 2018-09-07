"strict mode"
const config = require('config');
const express = require('express');
const application = express();
const apiRegistryRoutes = require('./gateway');
let rootRoute = '/afpforum';
if (config.has('Components.APIGateway.rootRoute')) {
    rootRoute = config.get('Components.APIGateway.rootRoute');
}
application.use(rootRoute, apiRegistryRoutes);
module.exports = application;