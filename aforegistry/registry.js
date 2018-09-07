"use strict"
const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();
const MServiceMgr = require('./MServiceMgr');
const traceMgr = new (require('../library/tracemgr'))('AFORegistry');
const DataShared = require('./DataShared').DataShared;
DataShared.initialize(traceMgr);

//------------------------------------------------------------------------------
// Gestionnaire de composants
//------------------------------------------------------------------------------
//const MServices = new MServiceMgr(traceMgr);

//------------------------------------------------------------------------------
// Demander la liste des composants disponibles
// http://localhost:5555/registry/list
//------------------------------------------------------------------------------
router.get('/list', (req, res) => {
    res.status(200).json(DataShared.MServices.listAll());
})
//------------------------------------------------------------------------------
// Réception de la déclaration d'un composant
// http://localhost:5555/registry/declare/MSType?host=...&port=...&pathname=....
//------------------------------------------------------------------------------
router.get('/declare/:MSType', (req, res) => {
    let ret = DataShared.MServices.declare(req.protocol, req.params.MSType, req.query.host, req.query.port, req.query.pathname);
    if (ret) {
        res.status(200).json({
            isSuccess: true,
            item: ret
        });
    } else {
        res.status(500).json({
            isSuccess: false,
            item: null
        });
    }
})

module.exports = router;