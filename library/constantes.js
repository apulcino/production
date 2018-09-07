"use strict"
const os = require('os');
const fetch = require('node-fetch');
const multicastSender = require('../library/multicastSender');

exports.MCastAppPort = 22222;
exports.MCastAppAddr = "224.0.0.222";
exports.MSRegistryUrl = process.env.MS_REGISTRY_URL || 'http://localhost:5555/registry';
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
exports.MSMessageTypeEnum = Object.freeze({
    "regAnnonce": 1,
    "regUpdate": 2,
    "compoDeclare": 3
});
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
exports.MSTypeEnum = Object.freeze({
    "afoEvents": 1,
    "afoPaniers": 2,
    "afoAuthent": 3
});
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
exports.MSPathnameEnum = Object.freeze({
    "afoHealth": "/health",
    "afoRegistry": "/api/v1/registry",
    "afoEvents": "/api/v1/events",
    "afoPaniers": "/api/v1/selections",
    "afoAuthent": "/api/v1/user"
});

//------------------------------------------------------------------------------
// Retrouver l'adresse IPV4 du serveur local
//------------------------------------------------------------------------------
exports.getServerPublicIpAddress = function () {
    const list = [];
    const ifaces = os.networkInterfaces();
    for (var prop in ifaces) {
        var iface = ifaces[prop];
        //console.log(prop + " => " + JSON.stringify(ifaces[prop]));
        for (let i = 0; i < iface.length; i++) {
            if (iface[i].internal === true) {
                continue;
            }
            list.push(iface[i].address);
        }
        if (0 === list.length) {
            list.push(os.hostname());
        }
        return list;
    }
}
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
const mcSender = new multicastSender(this.MCastAppPort, this.MCastAppAddr, this.getServerPublicIpAddress());
//------------------------------------------------------------------------------
// http://localhost:5555/registry/declare/MSType?url=....
//------------------------------------------------------------------------------
exports.declareService = function (traceMgr, _MSRegistryUrlArray, type, host, port, pathname) {
    mcSender.sendAlways(JSON.stringify({
        type: this.MSMessageTypeEnum.compoDeclare,
        compoType: type,
        host: host,
        port: port,
        pathname: pathname
    }), 10000);

    // _MSRegistryUrlArray = _MSRegistryUrlArray || [];
    // if (0 === _MSRegistryUrlArray.length) {
    //     return;
    // }
    // _MSRegistryUrlArray.forEach((_MSRegistryUrl) => {
    //     declareServiceOnce(traceMgr, _MSRegistryUrl.regUrl, type, host, port, pathname);
    // });
};
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// const declareServiceOnce = function (traceMgr, _MSRegistryUrl, type, host, port, pathname) {
//     _MSRegistryUrl = _MSRegistryUrl || '';
//     if (0 === _MSRegistryUrl.length) {
//         return;
//     }
//     const url = _MSRegistryUrl + '/registry/declare/' + type + '?host=' + host + '&port=' + port + '&pathname=' + pathname;
//     let val = {
//         host: host,
//         port: port,
//         pathname: pathname
//     };
//     traceMgr.info('Declcare : ', val);
//     return new Promise(function (resolve, reject) {
//         fetch(url, {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' },
//         }).then(response => {
//             resolve(true);
//         }).catch(err => {
//             traceMgr.error('declareService : Error : ', err.message);
//             resolve(false);
//         });
//     });
// };
//------------------------------------------------------------------------------
// Demander à la Registry indiquée, la liste des services disponibles
// GET http://.../registry/list
// [{"type":"3","url":"http://158.50.163.7:3000","pathname":"/api/user","status":true,"cptr":331}]
//------------------------------------------------------------------------------
exports.getServiceList = function (traceMgr, MSRegistryUrl) {
    const url = MSRegistryUrl.regUrl + this.MSPathnameEnum.afoRegistry + '/list';
    traceMgr.debug('Invoke : ', url);
    return new Promise(function (resolve, reject) {
        fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(response => {
            return response.json();
        }).then(function (json) {
            resolve(json);
        }).catch(err => {
            traceMgr.error('getServiceList : Error : ', err.message);
            reject(MSRegistryUrl);
        });
    });
};
//------------------------------------------------------------------------------
// Retrouver l'adresse IPV4 du serveur local
//------------------------------------------------------------------------------
exports.getServerIpAddress = function () {
    const ifaces = os.networkInterfaces();
    for (var prop in ifaces) {
        var iface = ifaces[prop];
        //console.log(prop + " => " + JSON.stringify(ifaces[prop]));
        for (let i = 0; i < iface.length; i++) {
            if (iface[i].family !== "IPv4") {
                continue;
            } else if (iface[i].internal === true) {
                continue;
            } else if (iface[i].address.indexOf('169.254.') !== -1) {
                continue;
            }
            return iface[i].address;
        }
    }
    return os.hostname();
};

//------------------------------------------------------------------------------
// Rechercher l'url du service qui sait répondre à cette API
//------------------------------------------------------------------------------
let indiceSelMService = 0;
exports.findActiveMService = function (MServiceList, reqUrl) {
    indiceSelMService++;
    MServiceList = MServiceList || [];
    reqUrl = reqUrl || '';
    var myMServices = MServiceList.filter(value => {
        if (true === value.status) {
            if (-1 !== reqUrl.indexOf(value.pathname)) {
                return value;
            }
        }
        return false;
    });
    // myMServices.sort((a, b) => { return a.cptr - b.cptr; });
    // choisir au hasard le composant
    switch (myMServices.length) {
        case 0:
            return undefined;
        case 1:
            return myMServices[0];
        default:
            return myMServices[indiceSelMService % myMServices.length];
    }
};