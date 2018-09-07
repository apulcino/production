const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
const apiConnect = 'https://connect.afpforum.com:443/v0.9';

//------------------------------------------------------------------------------
// middleware that is specific to this router
//------------------------------------------------------------------------------
router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

//------------------------------------------------------------------------------
// http://localhost:3002/api/selections
//------------------------------------------------------------------------------
router.get('/', (req, res) => {
    getApiSelections(req.query.auth).then(resp => {
        res.send(resp);
    }).catch(err => {
        console.log('Error 2 :', err);
    });
})
//------------------------------------------------------------------------------
// http://localhost:3002/api/selections/d4f23f5d-69fc-4d29-84d7-053ac10c16af?auth=10C5...BBAE
//------------------------------------------------------------------------------
router.get('/:selectionId', (req, res) => {
    getApiSelection(req.query.auth, req.params.selectionId).then(resp => {
        res.send(resp);
    }).catch(err => {
        console.log('Error 2 :', err);
    });
})
//------------------------------------------------------------------------------
// http://localhost:3002/api/selections/d4f23f5d-69fc-4d29-84d7-053ac10c16af/page/1?auth=10C5...BBAE
//------------------------------------------------------------------------------
router.get('/:selectionId/page/:page', (req, res) => {
    getApiSelectionPage(req.query.auth, req.params.selectionId, req.params.page).then(resp => {
        res.send(resp);
    }).catch(err => {
        console.log('Error 2 :', err);
    });
})

//------------------------------------------------------------------------------
// https://connect.afpforum.com:443/v0.9/api/selections/d4f23f5d-69fc-4d29-84d7-053ac10c16af?auth=10C5...BBAE
//------------------------------------------------------------------------------
function getApiSelectionPage(auth, selId, page) {
    const url = apiConnect + '/api/selections/' + selId + '/page/' + page + '?auth=' + auth;
    console.log('GET : ', url);
    return new Promise(function (resolve, reject) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-AFP-IGNORE-IP': 'true'
            },
        }).then(response => {
            return response.json();
        }).then(function (json) {
            delete json.DebugInfo;
            resolve(json.Data);
        }).catch(err => {
            console.log('getApiSelectionPage : Error : ', err);
            resolve(null);
        });
    });
}
//------------------------------------------------------------------------------
// https://connect.afpforum.com:443/v0.9/api/selections/d4f23f5d-69fc-4d29-84d7-053ac10c16af?auth=10C5...BBAE
//------------------------------------------------------------------------------
function getApiSelection(auth, selId) {
    const url = apiConnect + '/api/selections/' + selId + '?auth=' + auth;
    console.log('GET : ', url);
    return new Promise(function (resolve, reject) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-AFP-IGNORE-IP': 'true'
            },
        }).then(response => {
            return response.json();
        }).then(function (json) {
            delete json.DebugInfo;
            resolve(json.Data);
        }).catch(err => {
            console.log('getApiSelection : Error : ', err);
            resolve(null);
        });
    });
}
//------------------------------------------------------------------------------
// https://connect.afpforum.com:443/v0.9/api/selections?auth=10C...BBAE
//------------------------------------------------------------------------------
function getApiSelections(auth) {
    const url = apiConnect + '/api/selections?auth=' + auth;
    console.log('GET : ', url);
    return new Promise(function (resolve, reject) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-AFP-IGNORE-IP': 'true'
            },
        }).then(response => {
            return response.json();
        }).then(function (json) {
            delete json.DebugInfo;
            resolve(json.Data);
        }).catch(err => {
            console.log('getApiSelections : Error : ', err);
            resolve(null);
        });
    });
}

module.exports = router;